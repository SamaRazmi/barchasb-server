// src/controllers/StatsController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

// ====== توابع کمکی ======
const getAdModel = (adType: string) => {
  switch (adType) {
    case "EmployerAd":
      return prisma.employerAd;
    case "JobSeekerAd":
      return prisma.jobSeekerAd;
    case "SellerAd":
      return prisma.sellerAd;
    case "DigitalAd":
      return prisma.digitalAd;
    default:
      throw new Error("Invalid ad type");
  }
};

const verifyToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token format");
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  return (decoded as any).id || (decoded as any).userId;
};

// ========== 1. ثبت بازدید آگهی ==========
export const trackAdView = async (req: Request, res: Response) => {
  try {
    const { adId, adType } = req.body;
    if (!adId || !adType)
      return res.status(400).json({ error: "adId and adType required" });

    const AdModel = getAdModel(adType);
    const ad = await (AdModel as any).findUnique({
      where: { id: adId },
      select: { owner: true },
    });
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    await prisma.adView.create({
      data: {
        adId,
        adType: adType as any,
        ownerId: ad.owner,
        viewedAt: new Date(),
      },
    });

    res.status(201).json({ message: "View tracked successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== 2. دریافت آمار همه آگهی‌های کاربر ==========
export const getUserViewStats = async (req: Request, res: Response) => {
  try {
    const userId = verifyToken(req);
    const { period = "weekly", adType } = req.query;

    // ✅ تبدیل مطمئن به string
    const adTypeStr = String(adType || "");
    const periodStr = String(period || "weekly");

    let startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (periodStr === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    const whereClause: any = {
      ownerId: userId,
      viewedAt: { gte: startDate, lte: endDate },
    };
    if (adTypeStr && adTypeStr !== "all") {
      whereClause.adType = adTypeStr; // ✅ اینجا adTypeStr از نوع string است
    }

    const views = await prisma.adView.findMany({
      where: whereClause,
      select: { viewedAt: true, adType: true },
    });

    if (periodStr === "weekly") {
      const dayNameMap: Record<number, string> = {
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
      const viewsMap: Record<string, number> = {};
      views.forEach((v) => {
        const day = v.viewedAt.getDay() === 0 ? 7 : v.viewedAt.getDay();
        const dayName = dayNameMap[day];
        if (dayName) viewsMap[dayName] = (viewsMap[dayName] || 0) + 1;
      });
      const formatted = orderedDays.map((day) => ({
        label: day,
        views: viewsMap[day] || 0,
      }));
      return res.json(formatted);
    } else {
      const dateMap: Record<string, number> = {};
      views.forEach((v) => {
        const dateStr = v.viewedAt.toISOString().slice(0, 10);
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      });
      const formatted = [];
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const dateStr = cur.toISOString().slice(0, 10);
        formatted.push({ label: dateStr, views: dateMap[dateStr] || 0 });
        cur.setDate(cur.getDate() + 1);
      }
      return res.json(formatted);
    }
  } catch (error: any) {
    console.error(error);
    if (
      error.message === "No token provided" ||
      error.name === "JsonWebTokenError"
    )
      return res.status(401).json({ error: "Unauthorized" });
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== 3. دریافت آمار یک آگهی مشخص ==========
export const getAdViewStats = async (req: Request, res: Response) => {
  try {
    const { adId, adType, period = "weekly" } = req.query;

    if (!adId || !adType) {
      return res.status(400).json({ error: "adId and adType are required" });
    }

    // ✅ تبدیل مطمئن به string
    const adIdStr = String(adId);
    const adTypeStr = String(adType);
    const periodStr = String(period || "weekly");

    const userId = verifyToken(req);

    const AdModel = getAdModel(adTypeStr);
    const ad = await (AdModel as any).findUnique({
      where: { id: adIdStr },
      select: { owner: true },
    });
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    if (ad.owner !== userId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this ad" });
    }

    let startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (periodStr === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    const views = await prisma.adView.findMany({
      where: {
        adId: adIdStr, // ✅ string
        adType: adTypeStr as any,
        viewedAt: { gte: startDate, lte: endDate },
      },
      select: { viewedAt: true },
    });

    if (periodStr === "weekly") {
      const dayNameMap: Record<number, string> = {
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
      const viewsMap: Record<string, number> = {};
      views.forEach((v) => {
        const day = v.viewedAt.getDay() === 0 ? 7 : v.viewedAt.getDay();
        const dayName = dayNameMap[day];
        if (dayName) viewsMap[dayName] = (viewsMap[dayName] || 0) + 1;
      });
      const formatted = orderedDays.map((day) => ({
        label: day,
        views: viewsMap[day] || 0,
      }));
      return res.json(formatted);
    } else {
      const dateMap: Record<string, number> = {};
      views.forEach((v) => {
        const dateStr = v.viewedAt.toISOString().slice(0, 10);
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      });
      const formatted = [];
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const dateStr = cur.toISOString().slice(0, 10);
        formatted.push({ label: dateStr, views: dateMap[dateStr] || 0 });
        cur.setDate(cur.getDate() + 1);
      }
      return res.json(formatted);
    }
  } catch (error: any) {
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

// ========== 4. خلاصه آمار یک آگهی ==========
export const getAdViewSummaryStats = async (req: Request, res: Response) => {
  try {
    const { adId, adType } = req.query;

    if (!adId || !adType) {
      return res.status(400).json({ error: "adId and adType are required" });
    }

    // ✅ تبدیل مطمئن به string
    const adIdStr = String(adId);
    const adTypeStr = String(adType);

    const userId = verifyToken(req);

    const AdModel = getAdModel(adTypeStr);
    const ad = await (AdModel as any).findUnique({
      where: { id: adIdStr },
      select: { owner: true },
    });
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    if (ad.owner !== userId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this ad" });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const todayCount = await prisma.adView.count({
      where: {
        adId: adIdStr,
        adType: adTypeStr as any,
        viewedAt: { gte: startOfToday, lte: endOfToday },
      },
    });

    const totalCount = await prisma.adView.count({
      where: {
        adId: adIdStr,
        adType: adTypeStr as any,
      },
    });

    const weeklyData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const count = await prisma.adView.count({
        where: {
          adId: adIdStr,
          adType: adTypeStr as any,
          viewedAt: { gte: date, lt: nextDate },
        },
      });
      weeklyData.push(count);
    }

    const monthlyData: number[] = [];
    for (let week = 3; week >= 0; week--) {
      const end = new Date(now);
      end.setDate(now.getDate() - week * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const count = await prisma.adView.count({
        where: {
          adId: adIdStr,
          adType: adTypeStr as any,
          viewedAt: { gte: start, lte: end },
        },
      });
      monthlyData.push(count);
    }

    res.json({
      today: todayCount,
      total: totalCount,
      weekly: weeklyData,
      monthly: monthlyData,
    });
  } catch (error: any) {
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

// =================== export default ===================
const StatsController = {
  trackAdView,
  getUserViewStats,
  getAdViewStats,
  getAdViewSummaryStats,
};

export default StatsController;