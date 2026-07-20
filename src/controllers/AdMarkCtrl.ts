import { Request, Response } from "express";

const AdMark = require("../models/AdMark");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd");
const DigitalAd = require("../models/DigitalAd");

// ➕ اضافه یا حذف مارک روی آگهی (با احراز هویت)
export const toggleMark = async (req: Request, res: Response) => {
  const { adId } = req.params;
  const { adType } = req.body;
  const userId = (req as any).user?.id; // دریافت از توکن

  try {
    if (!userId || !adType) {
      return res.status(400).json({ error: "پارامترهای لازم ارسال نشده" });
    }

    const existing = await AdMark.findOne({ userId, adId, adType });

    if (existing) {
      await AdMark.deleteOne({ _id: existing._id });
      return res.json({ marked: false });
    }

    const newMark = await AdMark.create({ userId, adId, adType });
    res.json({ marked: true, markId: newMark._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در سرور" });
  }
};

// 📥 گرفتن همه آگهی‌های نشان شده یک کاربر بر اساس نوع آگهی (با احراز هویت)
export const getMarkedAds = async (req: Request, res: Response) => {
  const { adType } = req.params;
  const userId = (req as any).user?.id; // دریافت از توکن

  // اطمینان از اینکه کاربر فقط اطلاعات خودش را می‌بیند
  // (اختیاری: می‌توان بررسی کرد که userId مسیر با userId توکن یکی باشد)

  try {
    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const marks = await AdMark.find({ userId, adType });

    let ads = [];
    const adIds = marks.map((m: any) => m.adId);

    if (adType === "EmployerAd") {
      ads = await EmployerAd.find({ _id: { $in: adIds } });
    } else if (adType === "JobSeekerAd") {
      ads = await JobSeekerAd.find({ _id: { $in: adIds } });
    } else if (adType === "SellerAd") {
      ads = await SellerAd.find({ _id: { $in: adIds } });
    } else if (adType === "DigitalAd") {
      ads = await DigitalAd.find({ _id: { $in: adIds } });
    } else {
      return res.status(400).json({ error: "نوع آگهی معتبر نیست" });
    }

    const response = marks.map((mark: any) => {
      const ad = ads.find(
        (a: any) => a._id.toString() === mark.adId.toString(),
      );
      return {
        markId: mark._id,
        adType: mark.adType,
        ad,
      };
    });

    res.json({ success: true, marks: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در گرفتن نشان شده‌ها" });
  }
};

// 📥 گرفتن همه نشان شده‌ها بدون فیلتر نوع (با احراز هویت)
export const getAllMarkedAds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // دریافت از توکن

    if (!userId) {
      return res.status(401).json({ error: "احراز هویت نشده" });
    }

    const marks = await AdMark.find({ userId });

    const populatedMarks = await Promise.all(
      marks.map(async (mark: any) => {
        let adModel;
        switch (mark.adType) {
          case "EmployerAd":
            adModel = EmployerAd;
            break;
          case "JobSeekerAd":
            adModel = JobSeekerAd;
            break;
          case "SellerAd":
            adModel = SellerAd;
            break;
          case "DigitalAd":
            adModel = DigitalAd;
            break;
          default:
            return null;
        }

        const ad = await adModel.findById(mark.adId);
        return ad ? { markId: mark._id, adType: mark.adType, ad } : null;
      }),
    );

    res.status(200).json({
      success: true,
      marks: populatedMarks.filter((m) => m !== null),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "خطا در گرفتن نشان شده‌ها" });
  }
};

// 📌 چک کردن اینکه یک آگهی برای کاربر نشان شده یا نه (با احراز هویت)
export const isAdMarked = async (req: Request, res: Response) => {
  const { id: adId } = req.params;
  const { adType } = req.query;
  const userId = (req as any).user?.id;

  try {
    if (!userId || !adType) {
      return res.json({ marked: false });
    }

    const exists = await AdMark.exists({
      userId,
      adId,
      adType,
    });

    return res.json({ marked: !!exists });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ marked: false });
  }
};

// ======================== BATCH FUNCTION WITH AUTH ========================
/**
 * بررسی گروهی (Batch) نشان‌گذاری آگهی‌ها برای کاربر جاری
 * دریافت لیستی از { adId, adType } و بازگرداندن وضعیت نشان برای هر کدام
 * userId از توکن احراز هویت استخراج می‌شود
 */
export const batchIsMarked = async (req: Request, res: Response) => {
  // دریافت userId از توکن (که توسط middleware به req.user اضافه شده)
  const userId = (req as any).user?.id;
  const { items } = req.body;

  // اعتبارسنجی ورودی
  if (!userId) {
    return res.status(401).json({ error: "احراز هویت نشده" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "آیتم‌های مورد نظر ارسال نشده‌اند" });
  }

  try {
    // ساخت آرایه‌ای از شرط‌های جستجو برای هر آیتم
    const conditions = items.map((item: { adId: string; adType: string }) => ({
      userId,
      adId: item.adId,
      adType: item.adType,
    }));

    // یک کوئری با $or برای دریافت همه مارک‌های مورد نیاز در یک بار
    const marks = await AdMark.find({ $or: conditions });

    // ساخت Map برای جستجوی سریع
    const markMap = new Map<string, boolean>();
    marks.forEach((mark: any) => {
      const key = `${mark.adId}_${mark.adType}`;
      markMap.set(key, true);
    });

    // ساخت پاسخ برای هر آیتم
    const results = items.map((item: { adId: string; adType: string }) => ({
      adId: item.adId,
      marked: markMap.has(`${item.adId}_${item.adType}`),
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در بررسی گروهی نشان‌گذاری" });
  }
};
