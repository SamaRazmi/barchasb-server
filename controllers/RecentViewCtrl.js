const RecentView = require("../models/RecentView");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd");
const DigitalAd = require("../models/DigitalAd");

// 📌 ثبت یا آپدیت بازدید اخیر بدون خطای duplicate
exports.addRecentView = async (req, res) => {
  try {
    const { ownerId, adId, adType } = req.params;

    if (!ownerId || !adId || !adType) {
      return res.status(400).json({
        message: "ownerId, adId and adType are required in params",
      });
    }

    // فقط روی { user, ad } چک می‌کنیم، adType و viewedAt آپدیت میشه
    await RecentView.findOneAndUpdate(
      { user: ownerId, ad: adId }, // فیلتر فقط user و ad
      { adType, viewedAt: new Date() }, // مقدارهایی که آپدیت میشه
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // نگه داشتن فقط ۲۰ بازدید آخر
    const extraViews = await RecentView.find({ user: ownerId })
      .sort({ viewedAt: -1 })
      .skip(20)
      .select("_id");

    if (extraViews.length > 0) {
      await RecentView.deleteMany({
        _id: { $in: extraViews.map((v) => v._id) },
      });
    }

    res.status(200).json({ message: "Recent view saved" });
  } catch (err) {
    console.error("Error in addRecentView:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 گرفتن بازدیدهای اخیر یک کاربر بر اساس نوع آگهی
exports.getRecentViews = async (req, res) => {
  try {
    const { ownerId, adType } = req.params;

    if (!ownerId || !adType) {
      return res.status(400).json({
        message: "ownerId and adType are required in params",
      });
    }

    const recentViews = await RecentView.find({ user: ownerId, adType })
      .sort({ viewedAt: -1 })
      .limit(20);

    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let adModel;
        switch (view.adType) {
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
            return view;
        }

        const ad = await adModel.findById(view.ad);
        return { ...view.toObject(), ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err) {
    console.error("Error in getRecentViews:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 گرفتن همه بازدیدها بدون فیلتر نوع
exports.getAllRecentViews = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required in params" });
    }

    const recentViews = await RecentView.find({ user: ownerId })
      .sort({ viewedAt: -1 })
      .limit(20);

    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let adModel;
        switch (view.adType) {
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
            return view;
        }

        const ad = await adModel.findById(view.ad);
        return { ...view.toObject(), ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err) {
    console.error("Error in getAllRecentViews:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getRecentViewsAdvanced = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { adType = "all", time = "all", page = 1, limit = 20 } = req.query;

    const filter = { user: ownerId };

    // فیلتر نوع آگهی
    if (adType !== "all") {
      filter.adType = adType;
    }

    // فیلتر زمان
    const now = new Date();
    if (time === "today") {
      filter.viewedAt = {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
      };
    } else if (time === "week") {
      filter.viewedAt = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
    } else if (time === "month") {
      filter.viewedAt = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    }

    const recentViews = await RecentView.find(filter)
      .sort({ viewedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // populate دستی (همون منطق قبلی)
    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let adModel;
        switch (view.adType) {
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
            return view;
        }

        const ad = await adModel.findById(view.ad);
        return { ...view.toObject(), ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err) {
    console.error("Error in getRecentViewsAdvanced:", err);
    res.status(500).json({ message: err.message });
  }
};
