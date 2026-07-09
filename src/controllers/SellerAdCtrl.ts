import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { promises as fs } from "fs";
import path from "path";
import { AdType } from "@prisma/client";

// ==========================================
// 📋 لیست فیلدهای مجاز در مدل SellerAd
// ==========================================
const ALLOWED_FIELDS = [
  "owner",
  "title",
  "description",
  "category",
  "state",
  "city",
  "application",
  "status",
  "images",
  "priceIRT",
  "isFixedPrice",
  "isNegotiable",
  "hasWarranty",
  "isShippable",
  "extraFeatures",
  "rating",
  "person",
  "isVerified",
  "enableChat",
  "enablePhone",
  "paymentMethod",
  "adStatus",
  "approvedAt",
  "expiresAt",
] as const;

// ==========================================
// 🧹 فیلترکننده (فقط فیلدهای مجاز)
// ==========================================
function filterAdData(data: any): any {
  const filtered: any = {};
  for (const key of ALLOWED_FIELDS) {
    if (data[key] !== undefined) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

// تابع کمکی برای تبدیل params به string
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// ==========================================
// 📌 ایجاد آگهی فروشنده
// ==========================================
export const createSellerAd = async (req: Request, res: Response) => {
  console.log("\n🚀 createSellerAd START");
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = { ...req.body };

    // ─── پردازش images (همیشه آرایه) ───
    let uploadedFiles = (req as any).files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }
    const mainIndex = Number(req.body.mainImageIndex || 0);
    const images = uploadedFiles.map((file: any, i: number) => ({
      url: file.location || file.path || "",
      isMain: i === mainIndex,
    }));
    updateData.images = images;

    // ─── پردازش extraFeatures ───
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures =
          typeof req.body.extraFeatures === "string"
            ? JSON.parse(req.body.extraFeatures)
            : req.body.extraFeatures;
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
        extraFeatures = {};
      }
    }
    updateData.extraFeatures = extraFeatures;

    // ─── تبدیل فیلدهای بولی ───
    const toBool = (v: any) => v === "true" || v === true;
    const BOOLEAN_FIELDS = [
      "isFixedPrice",
      "isNegotiable",
      "hasWarranty",
      "isShippable",
      "isVerified",
      "enableChat",
      "enablePhone",
    ];
    BOOLEAN_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = toBool(req.body[field]);
      }
    });

    // ─── پردازش priceIRT ───
    if (req.body.priceIRT !== undefined) {
      const priceStr = String(req.body.priceIRT).replace(/,/g, "");
      updateData.priceIRT = parseInt(priceStr) || 0;
    }

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    // person: فقط "self" یا "other"
    const validPerson = ["self", "other"];
    if (updateData.person) {
      if (!validPerson.includes(updateData.person)) {
        updateData.person = "self";
        console.warn(`⚠️ person مقدار نامعتبر داشت، به "self" تغییر یافت`);
      }
    } else {
      updateData.person = "self";
    }

    // paymentMethod: فقط "Subscription", "Wallet", "Bank_card" — مقدار پیش‌فرض Subscription
    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (updateData.paymentMethod) {
      if (!validPayment.includes(updateData.paymentMethod)) {
        updateData.paymentMethod = "Subscription";
        console.warn(
          `⚠️ paymentMethod مقدار نامعتبر داشت، به "Subscription" تغییر یافت`,
        );
      }
    } else {
      updateData.paymentMethod = "Subscription";
    }

    // adStatus: فقط "pending", "approved", "rejected", "expired"
    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus) {
      if (!validStatus.includes(updateData.adStatus)) {
        updateData.adStatus = "pending";
        console.warn(`⚠️ adStatus مقدار نامعتبر داشت، به "pending" تغییر یافت`);
      }
    } else {
      updateData.adStatus = "pending";
    }

    // ─── فیلتر کردن داده‌ها ───
    const filteredData = filterAdData(updateData);

    // ─── ساخت آگهی با owner ───
    const ad = await prisma.sellerAd.create({
      data: {
        owner: (req as any).user?.id || req.body.owner,
        ...filteredData,
        adStatus: "pending_payment",
        paymentMethod: req.body.paymentMethod || "Bank_card",
      },
    });

    console.log("✅ SellerAd created successfully");
    res.status(201).json({ message: "Seller ad saved successfully", ad });
  } catch (err: any) {
    console.error("❌ ERROR CREATING SELLER AD:", err);
    res
      .status(400)
      .json({ message: "Seller ad save failed", error: err.message });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌ها
// ==========================================
export const getAllSellerAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      prisma.sellerAd.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ownerRelation: {
            select: {
              name: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      prisma.sellerAd.count(),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.SellerAd);

        return {
          ...ad,
          owner: ad.ownerRelation
            ? {
                fullName: `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
                phoneNumber: ad.ownerRelation.phone,
              }
            : null,
          ownerRelation: undefined,
          enhancements: {
            isSpecial: enhancement.isSpecial,
            specialStartDate: enhancement.specialStartDate,
            specialEndDate: enhancement.specialEndDate,
            isLadder: enhancement.isLadder,
            ladders: enhancement.ladders,
          },
        };
      })
    );

    res.json({
      data: formattedAds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("❌ ERROR GETTING ALL SELLER ADS:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت یک آگهی فروشنده
// ==========================================
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

    const enhancement = await getAdEnhancement(ad.id, AdType.SellerAd);

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
      enhancements: {
        isSpecial: enhancement.isSpecial,
        specialStartDate: enhancement.specialStartDate,
        specialEndDate: enhancement.specialEndDate,
        isLadder: enhancement.isLadder,
        ladders: enhancement.ladders,
      },
    };

    res.json(formattedAd);
  } catch (err: any) {
    console.error("❌ ERROR GETTING SELLER AD BY ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 گرفتن آگهی‌های یک کاربر خاص
// ==========================================
export const getAdsByOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    if (!ownerId) {
      return res.status(400).json({ message: "شناسه کاربر نامعتبر است" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      prisma.sellerAd.findMany({
        where: { owner: ownerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ownerRelation: {
            select: {
              name: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      prisma.sellerAd.count({ where: { owner: ownerId } }),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.SellerAd);

        return {
          ...ad,
          owner: ad.ownerRelation
            ? {
                fullName: `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
                phoneNumber: ad.ownerRelation.phone,
              }
            : null,
          ownerRelation: undefined,
          enhancements: {
            isSpecial: enhancement.isSpecial,
            specialStartDate: enhancement.specialStartDate,
            specialEndDate: enhancement.specialEndDate,
            isLadder: enhancement.isLadder,
            ladders: enhancement.ladders,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: formattedAds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("❌ ERROR GETTING SELLER ADS BY OWNER:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ==========================================
// 📌 گرفتن یک آگهی مشخص از یک کاربر مشخص
// ==========================================
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

    const enhancement = await getAdEnhancement(ad.id, AdType.SellerAd);

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
          }
        : null,
      ownerRelation: undefined,
      enhancements: {
        isSpecial: enhancement.isSpecial,
        specialStartDate: enhancement.specialStartDate,
        specialEndDate: enhancement.specialEndDate,
        isLadder: enhancement.isLadder,
        ladders: enhancement.ladders,
      },
    };

    res.status(200).json({ status: "success", ad: formattedAd });
  } catch (err: any) {
    console.error("❌ ERROR GETTING SELLER AD BY OWNER AND ID:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ==========================================
// 📌 ویرایش آگهی
// ==========================================
export const updateSellerAd = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const updateData: any = { ...req.body };

    // ─── پردازش images ───
    let newUploadedFiles = (req as any).files || [];
    let newImages: any[] = [];
    if (newUploadedFiles.length > 0) {
      const transformed = transformFileUrls(newUploadedFiles);
      newImages = transformed.map((file: any) => ({
        url: file.location || file.path,
        isMain: false,
      }));
    }

    let imagesFromApi: any[] = [];
    if (req.body.imagesFromApi) {
      try {
        imagesFromApi = JSON.parse(req.body.imagesFromApi);
      } catch (err) {
        console.error("❌ Invalid imagesFromApi JSON:", err);
        imagesFromApi = [];
      }
    }

    const finalImages = [
      ...imagesFromApi.map((img) => ({
        url: img.url,
        isMain: img.isMain || false,
      })),
      ...newImages,
    ];

    const mainIndex = Number(req.body.mainImageIndex || 0);
    if (finalImages.length > 0) {
      finalImages.forEach((img, i) => (img.isMain = i === mainIndex));
      if (!finalImages.some((img) => img.isMain)) finalImages[0].isMain = true;
    }

    if (finalImages.length > 0 || req.body.imagesFromApi) {
      updateData.images = finalImages;
    }

    // ─── پردازش extraFeatures ───
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures =
          typeof req.body.extraFeatures === "string"
            ? JSON.parse(req.body.extraFeatures)
            : req.body.extraFeatures;
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
        extraFeatures = {};
      }
    }
    updateData.extraFeatures = extraFeatures;

    // ─── تبدیل فیلدهای بولی ───
    const toBool = (v: any) => v === "true" || v === true;
    const BOOLEAN_FIELDS = [
      "isFixedPrice",
      "isNegotiable",
      "hasWarranty",
      "isShippable",
      "isVerified",
      "enableChat",
      "enablePhone",
    ];
    BOOLEAN_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = toBool(req.body[field]);
      }
    });

    // ─── پردازش priceIRT ───
    if (req.body.priceIRT !== undefined) {
      const priceStr = String(req.body.priceIRT).replace(/,/g, "");
      updateData.priceIRT = parseInt(priceStr) || 0;
    }

    // ─── اعتبارسنجی Enum ───
    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (
      updateData.paymentMethod &&
      !validPayment.includes(updateData.paymentMethod)
    ) {
      updateData.paymentMethod = "Subscription";
    } else if (!updateData.paymentMethod) {
      updateData.paymentMethod = "Subscription";
    }

    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus && !validStatus.includes(updateData.adStatus)) {
      updateData.adStatus = "pending";
    }

    // حذف فیلدهای اضافی
    delete updateData.imagesFromApi;
    delete updateData.mainImageIndex;

    // ─── فیلتر کردن ───
    const filteredData = filterAdData(updateData);

    const updatedAd = await prisma.sellerAd.update({
      where: { id: adId },
      data: filteredData,
    });

    if (!updatedAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err: any) {
    console.error("❌ ERROR UPDATING SELLER AD:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ==========================================
// 📌 حذف آگهی
// ==========================================
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

    const ad = await prisma.sellerAd.findFirst({
      where: { id: adId, owner: userId },
    });

    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا شما دسترسی حذف ندارید." });
    }

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

//  helper
async function getAdEnhancement(adId: string, adType: AdType) {
  const enhancement = await prisma.adEnhancement.findFirst({
    where: { adId, adType },
    include: {
      ladders: {
        orderBy: { scheduledAt: 'asc' },
      },
    },
  });

  if (!enhancement) {
    return {
      isSpecial: false,
      specialStartDate: null,
      specialEndDate: null,
      isLadder: false,
      ladders: [],
    };
  }

  const now = new Date();
  const isSpecialActive = enhancement.isSpecial &&
    enhancement.specialStartDate &&
    enhancement.specialEndDate &&
    enhancement.specialStartDate <= now &&
    enhancement.specialEndDate > now;

  return {
    isSpecial: isSpecialActive,
    specialStartDate: enhancement.specialStartDate,
    specialEndDate: enhancement.specialEndDate,
    isLadder: enhancement.ladders && enhancement.ladders.length > 0,
    ladders: enhancement.ladders || [],
  };
}
export default SellerAdCtrl;
