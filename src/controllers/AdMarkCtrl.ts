import { Request, Response } from "express";

const AdMark = require("../models/AdMark");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd");
const DigitalAd = require("../models/DigitalAd");

// ➕ اضافه یا حذف مارک روی آگهی
export const toggleMark = async (req: Request, res: Response) => {
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
export const getMarkedAds = async (req: Request, res: Response) => {
  const { userId, adType } = req.params;

  try {
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

// 📥 گرفتن همه نشان شده‌ها بدون فیلتر نوع (تمام آگهی‌ها)
export const getAllMarkedAds = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "آیدی کاربر ارسال نشده" });
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

// 📌 چک کردن اینکه یک آگهی برای کاربر نشان شده یا نه
export const isAdMarked = async (req: Request, res: Response) => {
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
