const AdMark = require("../models/AdMark");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd");
const DigitalAd = require("../models/DigitalAd"); // اگر جدول DigitalAd هم داری

// ➕ اضافه یا حذف مارک روی آگهی
exports.toggleMark = async (req, res) => {
  const { adId } = req.params;
  const { userId, adType } = req.body;

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

// 📥 گرفتن همه آگهی‌های نشان شده یک کاربر بر اساس نوع آگهی
exports.getMarkedAds = async (req, res) => {
  const { userId, adType } = req.params;

  try {
    // پیدا کردن همه مارک‌ها
    const marks = await AdMark.find({ userId, adType });

    // لیست خالی برای آگهی‌ها
    let ads = [];

    // populate دینامیک بر اساس نوع آگهی
    const adIds = marks.map((m) => m.adId);

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

    // بازگرداندن کل اطلاعات آگهی همراه با id مارک
    const response = marks.map((mark) => {
      const ad = ads.find((a) => a._id.toString() === mark.adId.toString());
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

// 📥 گرفتن همه نشان شده‌ها بدون فیلتر نوع (تمام آگهی‌ها)
exports.getAllMarkedAds = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "آیدی کاربر ارسال نشده" });

    const marks = await AdMark.find({ userId });

    // اگر بخوای populate همه نوع‌ها:
    const populatedMarks = await Promise.all(
      marks.map(async (mark) => {
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
      })
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
// 📌 چک کردن اینکه یک آگهی برای کاربر نشان شده یا نه
exports.isAdMarked = async (req, res) => {
  const { id: adId } = req.params;
  const { userId, adType } = req.query;

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
