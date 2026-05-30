const AdView = require("../models/AdView");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd");
const DigitalAd = require("../models/DigitalAd");

// ----- توابع کمکی -----
const getAdModel = (adType) => {
  switch (adType) {
    case "EmployerAd":
      return EmployerAd;
    case "JobSeekerAd":
      return JobSeekerAd;
    case "SellerAd":
      return SellerAd;
    case "DigitalAd":
      return DigitalAd;
    default:
      throw new Error("Invalid ad type");
  }
};

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token format");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId || decoded._id || decoded.id;
};

// ========== 1. ثبت بازدید آگهی (موجود) ==========
exports.trackAdView = async (req, res) => {
  try {
    const { adId, adType } = req.body;
    if (!adId || !adType)
      return res.status(400).json({ error: "adId and adType required" });

    const AdModel = getAdModel(adType);
    const ad = await AdModel.findById(adId).select("owner");
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    await AdView.create({
      adId,
      adType,
      ownerId: ad.owner,
      viewedAt: new Date(),
    });

    res.status(201).json({ message: "View tracked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== 2. دریافت آمار همه آگهی‌های کاربر (موجود) ==========
exports.getUserViewStats = async (req, res) => {
  try {
    const userId = verifyToken(req);
    const { period = "weekly", adType } = req.query;

    let startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (period === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    const matchStage = {
      ownerId: new mongoose.Types.ObjectId(userId),
      viewedAt: { $gte: startDate, $lte: endDate },
    };
    if (adType && adType !== "all") matchStage.adType = adType;

    let groupStage;
    if (period === "monthly") {
      groupStage = { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } };
    } else {
      groupStage = { $dayOfWeek: "$viewedAt" };
    }

    const pipeline = [
      { $match: matchStage },
      { $group: { _id: groupStage, views: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];

    const result = await AdView.aggregate(pipeline);

    if (period === "weekly") {
      const dayNameMap = {
        7: "شنبه",
        1: "یکشنبه",
        2: "دوشنبه",
        3: "سه‌شنبه",
        4: "چهارشنبه",
        5: "پنجشنبه",
        6: "جمعه",
      };
      const orderedDays = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
      ];
      const viewsMap = {};
      result.forEach((item) => {
        const dayName = dayNameMap[item._id];
        if (dayName) viewsMap[dayName] = item.views;
      });
      const formatted = orderedDays.map((day) => ({
        label: day,
        views: viewsMap[day] || 0,
      }));
      return res.json(formatted);
    } else {
      const dateMap = new Map(result.map((r) => [r._id, r.views]));
      const formatted = [];
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const dateStr = cur.toISOString().slice(0, 10);
        formatted.push({ label: dateStr, views: dateMap.get(dateStr) || 0 });
        cur.setDate(cur.getDate() + 1);
      }
      return res.json(formatted);
    }
  } catch (error) {
    console.error(error);
    if (
      error.message === "No token provided" ||
      error.name === "JsonWebTokenError"
    )
      return res.status(401).json({ error: "Unauthorized" });
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== 3. دریافت آمار یک آگهی مشخص (جدید) ==========
exports.getAdViewStats = async (req, res) => {
  try {
    const { adId } = req.params;
    const { adType, period = "weekly" } = req.query;

    if (!adId || !adType) {
      return res.status(400).json({ error: "adId and adType are required" });
    }

    // احراز هویت کاربر
    const userId = verifyToken(req);

    // بررسی مالکیت آگهی
    const AdModel = getAdModel(adType);
    const ad = await AdModel.findById(adId).select("owner");
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    if (ad.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this ad" });
    }

    // بازه زمانی
    let startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (period === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    // ساخت pipeline برای آگهی خاص
    const matchStage = {
      adId: new mongoose.Types.ObjectId(adId),
      adType: adType,
      viewedAt: { $gte: startDate, $lte: endDate },
    };

    let groupStage;
    if (period === "monthly") {
      groupStage = { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } };
    } else {
      groupStage = { $dayOfWeek: "$viewedAt" };
    }

    const pipeline = [
      { $match: matchStage },
      { $group: { _id: groupStage, views: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];

    const result = await AdView.aggregate(pipeline);

    // فرمت خروجی مشابه endpoint قبلی
    if (period === "weekly") {
      const dayNameMap = {
        7: "شنبه",
        1: "یکشنبه",
        2: "دوشنبه",
        3: "سه‌شنبه",
        4: "چهارشنبه",
        5: "پنجشنبه",
        6: "جمعه",
      };
      const orderedDays = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
      ];
      const viewsMap = {};
      result.forEach((item) => {
        const dayName = dayNameMap[item._id];
        if (dayName) viewsMap[dayName] = item.views;
      });
      const formatted = orderedDays.map((day) => ({
        label: day,
        views: viewsMap[day] || 0,
      }));
      return res.json(formatted);
    } else {
      const dateMap = new Map(result.map((r) => [r._id, r.views]));
      const formatted = [];
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const dateStr = cur.toISOString().slice(0, 10);
        formatted.push({ label: dateStr, views: dateMap.get(dateStr) || 0 });
        cur.setDate(cur.getDate() + 1);
      }
      return res.json(formatted);
    }
  } catch (error) {
    console.error(error);
    if (
      error.message === "No token provided" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
// ... (بقیه کدها مانند قبل) ...

// ========== تابع جدید: خلاصه آمار یک آگهی (today, total, weekly[], monthly[]) ==========
exports.getAdViewSummaryStats = async (req, res) => {
  try {
    const { adId } = req.params;
    const { adType } = req.query; // adType اجباری است

    if (!adId || !adType) {
      return res.status(400).json({ error: "adId and adType are required" });
    }

    // احراز هویت
    const userId = verifyToken(req);

    // بررسی مالکیت آگهی
    const AdModel = getAdModel(adType);
    const ad = await AdModel.findById(adId).select("owner");
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    if (ad.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this ad" });
    }

    // تاریخ امروز (منطق ایران - ساده گرفته شده)
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // 1) محاسبه today
    const todayCount = await AdView.countDocuments({
      adId: new mongoose.Types.ObjectId(adId),
      adType: adType,
      viewedAt: { $gte: startOfToday, $lte: endOfToday },
    });

    // 2) محاسبه total (کل بازدیدهای همیشه)
    const totalCount = await AdView.countDocuments({
      adId: new mongoose.Types.ObjectId(adId),
      adType: adType,
    });

    // 3) آرایه هفتگی (7 روز گذشته، هر روز جداگانه، به ترتیب از دیروز به عقب؟ بهتر است از امروز به عقب 7 روز)
    // اما کامپوننت فقط اعداد را نشان می‌دهد، ترتیب مهم نیست. من 7 روز گذشته را برمی‌گردانم (دیروز، پریروز، ...)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const count = await AdView.countDocuments({
        adId: new mongoose.Types.ObjectId(adId),
        adType: adType,
        viewedAt: { $gte: date, $lt: nextDate },
      });
      weeklyData.push(count);
    }

    // 4) آرایه ماهانه (4 هفته اخیر، هر هفته مجموع بازدیدها)
    const monthlyData = [];
    for (let week = 3; week >= 0; week--) {
      const end = new Date(now);
      end.setDate(now.getDate() - week * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const count = await AdView.countDocuments({
        adId: new mongoose.Types.ObjectId(adId),
        adType: adType,
        viewedAt: { $gte: start, $lte: end },
      });
      monthlyData.push(count);
    }

    res.json({
      today: todayCount,
      total: totalCount,
      weekly: weeklyData, // آرایه 7 تایی
      monthly: monthlyData, // آرایه 4 تایی
    });
  } catch (error) {
    console.error(error);
    if (
      error.message === "No token provided" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
