// src/controllers/SellerAdCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { promises as fs } from "fs";
import path from "path";

// تابع کمکی برای تبدیل params به string
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// ایجاد آگهی فروشنده
export const createSellerAd = async (req: Request, res: Response) => {
  try {
    // 🔹 تبدیل آدرس تصاویر به دامنه سفارشی
    let uploadedFiles = (req as any).files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }

    // 🔹 آرایه تصاویر از req.files (تبدیل شده)
    const images = uploadedFiles.map((file: any, i: number) => ({
      url: file.location || file.path,
      isMain: i === Number(req.body.mainImageIndex || 0),
    }));

    // 🔹 تبدیل Boolean ها
    const isFixedPrice = req.body.isFixedPrice === "true";
    const isNegotiable = req.body.isNegotiable === "true";
    const hasWarranty = req.body.hasWarranty === "true";
    const isShippable = req.body.isShippable === "true";

    // 🔹 تبدیل قیمت به Number (حذف ویرگول)
    const priceIRT = Number((req.body.priceIRT || "0").replace(/,/g, "")) || 0;

    // 🔹 extraFeatures از JSON string
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures = JSON.parse(req.body.extraFeatures);
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
      }
    }

    const ad = await prisma.sellerAd.create({
      data: {
        title: req.body.title,
        category: req.body.category,
        state: req.body.state,
        city: req.body.city,
        person: req.body.person || "self",
        priceIRT,
        isFixedPrice,
        isNegotiable,
        hasWarranty,
        isShippable,
        extraFeatures,
        images,
        owner: (req as any).user?.id || req.body.owner,
        adStatus: "pending",
        paymentMethod: req.body.paymentMethod || "Bank_card",
      },
    });

    res.status(201).json({ message: "Seller ad saved successfully", ad });
  } catch (err: any) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Seller ad save failed", error: err.message });
  }
};

// دریافت همه آگهی‌ها
export const getAllSellerAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.sellerAd.findMany({
      include: {
        ownerRelation: {
          select: {
            name: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // تبدیل به فرمت قبلی که populate("owner", "fullName phoneNumber") داشت
    const formattedAds = (ads as any[]).map((ad) => ({
      ...ad,
      owner: ad.ownerRelation
        ? {
            fullName: `${ad.ownerRelation.name || ""} ${
              ad.ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: ad.ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
    }));

    res.json(formattedAds);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// دریافت یک آگهی فروشنده
export const getSellerAdById = async (req: Request, res: Response) => {
  try {
    const adId = toStr(req.params.id);
    if (!adId) {
      return res.status(400).json({ message: "آدرس آگهی نامعتبر است" });
    }

    const ad = await prisma.sellerAd.findUnique({
      where: { id: adId },
      include: {
        ownerRelation: {
          select: {
            name: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${
              (ad as any).ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
    };

    res.json(formattedAd);
  } catch (err: any) {
    console.error("خطا در دریافت آگهی:", err);
    res.status(500).json({ error: err.message });
  }
};

// گرفتن آگهی‌های یک کاربر خاص
export const getAdsByOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    if (!ownerId) {
      return res.status(400).json({ message: "شناسه کاربر نامعتبر است" });
    }

    const ads = await prisma.sellerAd.findMany({
      where: { owner: ownerId },
      include: {
        ownerRelation: {
          select: {
            name: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    const formattedAds = (ads as any[]).map((ad) => ({
      ...ad,
      owner: ad.ownerRelation
        ? {
            fullName: `${ad.ownerRelation.name || ""} ${
              ad.ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: ad.ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
    }));

    res.status(200).json({ status: "success", ads: formattedAds });
  } catch (err: any) {
    console.error("❌ ERROR GETTING SELLER ADS BY OWNER:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 🔹 گرفتن یک آگهی مشخص از یک کاربر مشخص
export const getSellerAdByOwnerAndId = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const ad = await prisma.sellerAd.findFirst({
      where: {
        id: adId,
        owner: ownerId,
      },
      include: {
        ownerRelation: {
          select: {
            name: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${
              (ad as any).ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
    };

    res.status(200).json({ status: "success", ad: formattedAd });
  } catch (err: any) {
    console.error("❌ ERROR GETTING SELLER AD BY OWNER AND ID:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 🔹 ویرایش آگهی یک کاربر مشخص
export const updateSellerAd = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    // تصاویر جدید (در صورت وجود) با تبدیل آدرس
    let newUploadedFiles = (req as any).files || [];
    let newImages: any[] = [];
    if (newUploadedFiles.length > 0) {
      const transformed = transformFileUrls(newUploadedFiles);
      newImages = transformed.map((file: any) => ({
        url: file.location || file.path,
        isMain: false,
      }));
    }

    // تصاویر قدیمی از فرانت (imagesFromApi)
    let imagesFromApi: any[] = [];
    if (req.body.imagesFromApi) {
      try {
        imagesFromApi = JSON.parse(req.body.imagesFromApi);
      } catch (err) {
        console.error("❌ Invalid imagesFromApi JSON:", err);
        imagesFromApi = [];
      }
    }

    // ترکیب تصاویر
    const finalImages = [
      ...imagesFromApi.map((img) => ({
        url: img.url,
        isMain: img.isMain || false,
      })),
      ...newImages,
    ];

    // تعیین تصویر اصلی (بر اساس mainImageIndex اگر موجود باشد)
    const mainIndex = Number(req.body.mainImageIndex || 0);
    if (finalImages.length > 0) {
      finalImages.forEach((img, i) => (img.isMain = i === mainIndex));
      if (!finalImages.some((img) => img.isMain)) finalImages[0].isMain = true;
    }

    // extraFeatures از JSON string
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures = JSON.parse(req.body.extraFeatures);
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
      }
    }

    const updateData: any = {
      ...req.body,
      extraFeatures,
    };

    if (finalImages.length > 0) {
      updateData.images = finalImages;
    }

    // حذف فیلدهای اضافی
    delete updateData.imagesFromApi;

    const updatedAd = await prisma.sellerAd.update({
      where: { id: adId },
      data: updateData,
    });

    if (!updatedAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err: any) {
    console.error("❌ ERROR UPDATING SELLER AD:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * حذف آگهی فروشنده (فقط مالک)
 * @route DELETE /api/ads/seller/:adId
 */
export const deleteSellerAd = async (req: Request, res: Response) => {
  try {
    const adId = toStr(req.params.adId);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "احراز هویت لازم است" });
    }

    if (!adId) {
      return res.status(400).json({ message: "شناسه آگهی نامعتبر است" });
    }

    // یافتن آگهی و اطمینان از تعلق به کاربر جاری
    const ad = await prisma.sellerAd.findFirst({
      where: { id: adId, owner: userId },
    });

    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا شما دسترسی حذف ندارید." });
    }

    // حذف فایل‌های فیزیکی تصاویر (در صورت ذخیره محلی)
    const images = ad.images as any[];
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && !img.url.startsWith("http")) {
          const filePath = path.join(__dirname, "..", img.url);
          try {
            await fs.unlink(filePath);
          } catch (err: any) {
            console.warn(`حذف فایل ${filePath} ناموفق:`, err.message);
          }
        }
      }
    }

    // حذف سند آگهی از دیتابیس
    await prisma.sellerAd.delete({
      where: { id: adId },
    });

    res.status(200).json({ message: "آگهی با موفقیت حذف شد." });
  } catch (err: any) {
    console.error("❌ ERROR DELETING SELLER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};

// =================== export default ===================
const SellerAdCtrl = {
  createSellerAd,
  getAllSellerAds,
  getSellerAdById,
  getAdsByOwner,
  getSellerAdByOwnerAndId,
  updateSellerAd,
  deleteSellerAd,
};

export default SellerAdCtrl;