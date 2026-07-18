import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AdType } from "@prisma/client";

// ==========================================
// 📌 جستجوی یکپارچه در همه آگهی‌ها
// ==========================================
export const searchAllAds = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const state = (req.query.state as string) || "";
    const type = (req.query.type as string) || ""; // employer, jobseeker, seller, digital

    // ساخت شرط جستجو برای هر مدل
    const searchCondition = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
            { digitalTotalDesc: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    // شرط استان (بر اساس فیلد state یا province)
    const stateCondition = state
      ? {
          OR: [{ state: state }, { province: state }],
        }
      : {};

    // انتخاب نوع آگهی
    const types = type ? type.split(",").map((t) => t.trim()) : [];

    // تابع کمکی برای تبدیل به فرمت یکسان
    const formatAd = (ad: any, adType: string) => ({
      _id: ad.id,
      type: adType,
      title: ad.title || ad.name || "بدون عنوان",
      category: ad.category || ad.categories?.[0]?.name || "دسته‌بندی نشده",
      state: ad.state || ad.province || "",
      city: ad.city || "",
      images: (ad.images || []).map((img: any) => img.url || img),
      adStatus: ad.adStatus || "pending",
      createdAt: ad.createdAt.toISOString(),
      owner: ad.owner,
    });

    // آرایه برای جمع‌آوری نتایج
    let results: any[] = [];

    // 1️⃣ آگهی‌های کارفرما (EmployerAd)
    if (!types.length || types.includes("employer")) {
      const employerAds = await prisma.employerAd.findMany({
        where: {
          adStatus: "approved",
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { companyName: { contains: q, mode: "insensitive" } },
            ],
          }),
          ...(state && {
            OR: [{ state: state }],
          }),
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });
      results.push(...employerAds.map((ad) => formatAd(ad, "employer")));
    }

    // 2️⃣ آگهی‌های جوینده کار (JobSeekerAd)
    if (!types.length || types.includes("jobseeker")) {
      const jobSeekerAds = await prisma.jobSeekerAd.findMany({
        where: {
          adStatus: "approved",
          ...(q && {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { aboutMe: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
            ],
          }),
          ...(state && {
            state: state,
          }),
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });
      results.push(...jobSeekerAds.map((ad) => formatAd(ad, "jobseeker")));
    }

    // 3️⃣ آگهی‌های فروشنده (SellerAd)
    if (!types.length || types.includes("seller")) {
      const sellerAds = await prisma.sellerAd.findMany({
        where: {
          adStatus: "approved",
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }),
          ...(state && {
            state: state,
          }),
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });
      results.push(...sellerAds.map((ad) => formatAd(ad, "seller")));
    }

    // 4️⃣ آگهی‌های دیجیتال (DigitalAd)
    if (!types.length || types.includes("digital")) {
      const digitalAds = await prisma.digitalAd.findMany({
        where: {
          adStatus: "approved",
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { digitalTotalDesc: { contains: q, mode: "insensitive" } },
            ],
          }),
          ...(state && {
            province: state,
          }),
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });
      results.push(...digitalAds.map((ad) => formatAd(ad, "digital")));
    }

    // مرتب‌سازی کلی بر اساس createdAt (جدیدترین ابتدا)
    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // محدود کردن تعداد نهایی (اختیاری)
    const finalResults = results.slice(0, 50);

    res.json(finalResults);
  } catch (err: any) {
    console.error("❌ ERROR IN SEARCH ALL ADS:", err);
    res.status(500).json({ error: err.message });
  }
};
