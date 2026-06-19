import { Request, Response } from "express";
import prisma from "../config/prisma";

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// 📌 ثبت یا آپدیت بازدید اخیر
export const addRecentView = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);
    const adType = toStr(req.params.adType);

    if (!ownerId || !adId || !adType) {
      return res.status(400).json({
        message: "ownerId, adId and adType are required in params",
      });
    }

    await prisma.recentView.upsert({
      where: {
        user_ad: {
          user: ownerId,
          ad: adId,
        },
      },
      update: {
        adType: adType as any,
        viewedAt: new Date(),
      },
      create: {
        user: ownerId,
        ad: adId,
        adType: adType as any,
        viewedAt: new Date(),
      },
    });

    // نگه داشتن فقط ۲۰ بازدید آخر
    const extraViews = await prisma.recentView.findMany({
      where: { user: ownerId },
      orderBy: { viewedAt: "desc" },
      skip: 20,
      select: { id: true },
    });

    if (extraViews.length > 0) {
      await prisma.recentView.deleteMany({
        where: {
          id: { in: extraViews.map((v) => v.id) },
        },
      });
    }

    res.status(200).json({ message: "Recent view saved" });
  } catch (err: any) {
    console.error("Error in addRecentView:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 گرفتن بازدیدهای اخیر یک کاربر بر اساس نوع آگهی
export const getRecentViews = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adType = toStr(req.params.adType);

    if (!ownerId || !adType) {
      return res.status(400).json({
        message: "ownerId and adType are required in params",
      });
    }

    const recentViews = await prisma.recentView.findMany({
      where: { user: ownerId, adType: adType as any },
      orderBy: { viewedAt: "desc" },
      take: 20,
    });

    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let ad = null;
        switch (view.adType) {
          case "EmployerAd":
            ad = await prisma.employerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "JobSeekerAd":
            ad = await prisma.jobSeekerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "SellerAd":
            ad = await prisma.sellerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "DigitalAd":
            ad = await prisma.digitalAd.findUnique({
              where: { id: view.ad },
            });
            break;
        }
        return { ...view, ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err: any) {
    console.error("Error in getRecentViews:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 گرفتن همه بازدیدها بدون فیلتر نوع
export const getAllRecentViews = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required in params" });
    }

    const recentViews = await prisma.recentView.findMany({
      where: { user: ownerId },
      orderBy: { viewedAt: "desc" },
      take: 20,
    });

    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let ad = null;
        switch (view.adType) {
          case "EmployerAd":
            ad = await prisma.employerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "JobSeekerAd":
            ad = await prisma.jobSeekerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "SellerAd":
            ad = await prisma.sellerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "DigitalAd":
            ad = await prisma.digitalAd.findUnique({
              where: { id: view.ad },
            });
            break;
        }
        return { ...view, ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err: any) {
    console.error("Error in getAllRecentViews:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 پیشرفته: فیلتر نوع + زمان + pagination
export const getRecentViewsAdvanced = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const { adType = "all", time = "all", page = 1, limit = 20 } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required in params" });
    }

    const filter: any = { user: ownerId };

    if (adType !== "all") {
      filter.adType = adType as string;
    }

    const now = new Date();
    if (time === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      filter.viewedAt = { gte: startOfDay };
    } else if (time === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filter.viewedAt = { gte: weekAgo };
    } else if (time === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filter.viewedAt = { gte: startOfMonth };
    }

    const recentViews = await prisma.recentView.findMany({
      where: filter,
      orderBy: { viewedAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const populatedViews = await Promise.all(
      recentViews.map(async (view) => {
        let ad = null;
        switch (view.adType) {
          case "EmployerAd":
            ad = await prisma.employerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "JobSeekerAd":
            ad = await prisma.jobSeekerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "SellerAd":
            ad = await prisma.sellerAd.findUnique({
              where: { id: view.ad },
            });
            break;
          case "DigitalAd":
            ad = await prisma.digitalAd.findUnique({
              where: { id: view.ad },
            });
            break;
        }
        return { ...view, ad };
      }),
    );

    res.status(200).json(populatedViews);
  } catch (err: any) {
    console.error("Error in getRecentViewsAdvanced:", err);
    res.status(500).json({ message: err.message });
  }
};

// =================== export default ===================
const RecentViewCtrl = {
  addRecentView,
  getRecentViews,
  getAllRecentViews,
  getRecentViewsAdvanced,
};

export default RecentViewCtrl;
