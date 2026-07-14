import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { promises as fs } from "fs";
import path from "path";
import { AdType } from "@prisma/client";

// ==========================================
// 📋 لیست فیلدهای مجاز در مدل EmployerAd
// ==========================================
const ALLOWED_FIELDS = [
  "owner",
  "name",
  "title",
  "categories",
  "state",
  "city",
  "cooperationType",
  "gender",
  "militaryStatus",
  "experience",
  "paymentMethod",
  "isRemote",
  "thursdayUntilNoon",
  "startTime",
  "endTime",
  "minSalary",
  "maxSalary",
  "companyName",
  "companyType",
  "benefits",
  "insurance",
  "education",
  "companyDescription",
  "jobDetails",
  "rating",
  "person",
  "isVerified",
  "enableChat",
  "enablePhone",
  "adPaymentMethod",
  "adStatus",
  "images",
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
// 📌 ایجاد آگهی کارفرما
// ==========================================
export const createEmployerAd = async (req: Request, res: Response) => {
  console.log("\n🚀 createEmployerAd START");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = {};
    const isMultipart = req.headers["content-type"]?.includes(
      "multipart/form-data",
    );

    if (isMultipart) {
      // ========== پردازش FormData ==========
      updateData.name = req.body.name || "";
      updateData.title = req.body.title || "";
      updateData.state = req.body.state || "";
      updateData.city = req.body.city || "";
      updateData.cooperationType = req.body.cooperationType || "";
      updateData.gender = req.body.gender || "";
      updateData.militaryStatus = req.body.militaryStatus || "None";
      updateData.experience = req.body.experience || "";
      updateData.startTime = req.body.startTime || "";
      updateData.endTime = req.body.endTime || "";
      updateData.minSalary = req.body.minSalary || "";
      updateData.maxSalary = req.body.maxSalary || "";
      updateData.companyName = req.body.companyName || "";
      updateData.companyType = req.body.companyType || "";
      updateData.benefits = req.body.benefits || "";
      updateData.insurance = req.body.insurance || "";
      updateData.education = req.body.education || "";
      updateData.companyDescription = req.body.companyDescription || "";
      updateData.person = req.body.person || "self";

      // تصحیح adPaymentMethod
      let payment =
        req.body.adPaymentMethod || req.body.paymentMethod || "Bank_card";
      if (payment === "Bank card") payment = "Bank_card";
      updateData.adPaymentMethod = payment;

      // تبدیل بولی
      const toBool = (v: any) => v === "true" || v === true;
      updateData.isRemote = toBool(req.body.isRemote);
      updateData.thursdayUntilNoon = toBool(req.body.thursdayUntilNoon);
      updateData.enableChat = toBool(req.body.enableChat);
      updateData.enablePhone = toBool(req.body.enablePhone);
      updateData.isVerified = toBool(req.body.isVerified);

      // پردازش categories
      let categories = req.body.categories;
      if (typeof categories === "string") {
        try {
          categories = JSON.parse(categories);
        } catch {
          categories = [];
        }
      }
      if (!Array.isArray(categories)) categories = [];
      updateData.categories = categories;

      // پردازش jobDetails
      let jobDetails = req.body.jobDetails;
      if (typeof jobDetails === "string") {
        try {
          jobDetails = JSON.parse(jobDetails);
        } catch {
          jobDetails = [];
        }
      }
      if (!Array.isArray(jobDetails)) jobDetails = [];
      updateData.jobDetails = jobDetails;

      // پردازش images
      let uploadedImages = (req as any).files?.images || [];
      if (uploadedImages.length > 0) {
        uploadedImages = transformFileUrls(uploadedImages);
      }
      const images = uploadedImages.map((file: any, i: number) => ({
        url: file.location || file.path || "",
        isMain: i === 0,
      }));
      updateData.images = images;
    } else {
      // ========== پردازش JSON ==========
      Object.assign(updateData, req.body || {});

      // تصحیح adPaymentMethod
      if (updateData.adPaymentMethod === "Bank card") {
        updateData.adPaymentMethod = "Bank_card";
      }
      if (!updateData.adPaymentMethod) {
        updateData.adPaymentMethod = "Bank_card";
      }
      if (!updateData.images) updateData.images = [];
    }

    // ─── بررسی فیلد اجباری name ───
    if (!updateData.name) {
      return res.status(400).json({ error: "فیلد name اجباری است" });
    }

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (
      updateData.adPaymentMethod &&
      !validPayment.includes(updateData.adPaymentMethod)
    ) {
      updateData.adPaymentMethod = "Bank_card";
    }

    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus && !validStatus.includes(updateData.adStatus)) {
      updateData.adStatus = "pending";
    }

    // ─── فیلتر کردن داده‌ها ───
    const filteredData = filterAdData(updateData);

    // ─── بررسی وجود owner ───
    const ownerId = (req as any).user?.id || req.body.owner;
    if (!ownerId) {
      return res
        .status(400)
        .json({ error: "شناسه کاربر (owner) ارسال نشده است" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true },
    });
    if (!userExists) {
      return res.status(404).json({ error: "کاربر مورد نظر یافت نشد" });
    }

    // ─── ساخت آگهی ───
    const ad = await prisma.employerAd.create({
      data: {
        owner: ownerId,
        ...filteredData,
        adStatus: "pending_payment",
      },
    });

    console.log("✅ EmployerAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING EMPLOYER AD:", err);
    if (err.code === "P2003") {
      return res.status(400).json({ error: "کاربر نامعتبر یا وجود ندارد" });
    }
    res.status(400).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌ها
// ==========================================
export const getAllEmployerAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      prisma.employerAd.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      prisma.employerAd.count(),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.EmployerAd);

        return {
          ...ad,
          owner: ad.ownerRelation
            ? {
                fullName:
                  `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
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
      }),
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
    console.error("❌ ERROR GETTING ALL ADS:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت یک آگهی با ID
// ==========================================
export const getEmployerAdById = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) return res.status(400).json({ message: "شناسه نامعتبر است" });

    const ad = await prisma.employerAd.findUnique({
      where: { id },
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

    const enhancement = await getAdEnhancement(ad.id, AdType.EmployerAd);

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName:
              `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
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
    console.error("❌ ERROR GETTING AD BY ID:", err);
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
      prisma.employerAd.findMany({
        where: { owner: ownerId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      prisma.employerAd.count({ where: { owner: ownerId } }),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.EmployerAd);

        return {
          ...ad,
          owner: ad.ownerRelation
            ? {
                fullName:
                  `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
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
      }),
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ==========================================
// 📌 گرفتن یک آگهی مشخص از یک کاربر مشخص
// ==========================================
export const getEmployerAdByOwnerAndId = async (
  req: Request,
  res: Response,
) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const ad = await prisma.employerAd.findFirst({
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

    const enhancement = await getAdEnhancement(ad.id, AdType.EmployerAd);

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName:
              `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
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
    console.error("❌ ERROR GETTING AD BY OWNER AND ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 ویرایش آگهی (با اعتبارسنجی و پیش‌فرض)
// ==========================================
export const updateEmployerAd = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    // ─── پردازش images ───
    let newUploadedFiles: any[] = (req as any).files || [];
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

    const finalImages = [
      ...imagesFromApi.map((img) => ({
        url: img.url,
        isMain: img.isMain || false,
      })),
      ...newImages,
    ];
    if (!finalImages.some((img) => img.isMain) && finalImages.length > 0) {
      finalImages[0].isMain = true;
    }

    // ─── پردازش categories ───
    let categories = req.body.categories;
    if (typeof categories === "string") {
      try {
        categories = JSON.parse(categories);
        if (!Array.isArray(categories)) categories = [];
      } catch (err) {
        console.error("❌ Invalid categories JSON:", err);
        categories = [];
      }
    } else if (!Array.isArray(categories)) {
      categories = [];
    }

    // ─── پردازش jobDetails ───
    let jobDetails = req.body.jobDetails;
    if (typeof jobDetails === "string") {
      try {
        jobDetails = JSON.parse(jobDetails);
        if (!Array.isArray(jobDetails)) jobDetails = [];
      } catch (err) {
        console.error("❌ Invalid jobDetails JSON:", err);
        jobDetails = [];
      }
    } else if (!Array.isArray(jobDetails)) {
      jobDetails = [];
    }

    // ─── پردازش فیلدهای بولی ───
    const toBool = (v: any) => v === "true" || v === true;
    const isRemote = toBool(req.body.isRemote);
    const thursdayUntilNoon = toBool(req.body.thursdayUntilNoon);
    const enableChat = toBool(req.body.enableChat);
    const enablePhone = toBool(req.body.enablePhone);

    // ─── ساخت updateData ───
    const updateData: any = {
      ...req.body,
      images: finalImages,
      categories,
      jobDetails,
      isRemote,
      thursdayUntilNoon,
      enableChat,
      enablePhone,
    };

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (updateData.adPaymentMethod) {
      if (updateData.adPaymentMethod === "Bank card")
        updateData.adPaymentMethod = "Bank_card";
      if (!validPayment.includes(updateData.adPaymentMethod)) {
        updateData.adPaymentMethod = "Bank_card";
      }
    } else {
      updateData.adPaymentMethod = "Bank_card";
    }

    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus && !validStatus.includes(updateData.adStatus)) {
      updateData.adStatus = "pending";
    }

    // حذف فیلدهای اضافی
    delete updateData.imagesFromApi;
    delete updateData.isRemote;
    delete updateData.thursdayUntilNoon;
    delete updateData.enableChat;
    delete updateData.enablePhone;

    // ─── فیلتر کردن ───
    const filteredData = filterAdData(updateData);

    // ─── به‌روزرسانی ───
    const updatedAd = await prisma.employerAd.update({
      where: { id: adId },
      data: filteredData,
    });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err: any) {
    console.error("❌ ERROR UPDATING AD:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 حذف آگهی
// ==========================================
export const deleteEmployerAd = async (req: Request, res: Response) => {
  try {
    const adId = toStr(req.params.adId);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "احراز هویت لازم است" });
    }
    if (!adId) {
      return res.status(400).json({ message: "شناسه آگهی نامعتبر است" });
    }

    const ad = await prisma.employerAd.findFirst({
      where: { id: adId, owner: userId },
    });

    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا دسترسی ندارید." });
    }

    // حذف فایل‌های فیزیکی (در صورت ذخیره محلی)
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

    await prisma.employerAd.delete({
      where: { id: adId },
    });

    res.status(200).json({ message: "آگهی کارفرما با موفقیت حذف شد." });
  } catch (err: any) {
    console.error("❌ ERROR DELETING EMPLOYER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};

//  helper
async function getAdEnhancement(adId: string, adType: AdType) {
  const enhancement = await prisma.adEnhancement.findFirst({
    where: { adId, adType },
    include: {
      ladders: {
        orderBy: { scheduledAt: "asc" },
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
  const isSpecialActive =
    enhancement.isSpecial &&
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

// =================== export default ===================
const EmployerAdCtrl = {
  createEmployerAd,
  getAllEmployerAds,
  getEmployerAdById,
  getAdsByOwner,
  getEmployerAdByOwnerAndId,
  updateEmployerAd,
  deleteEmployerAd,
};

export default EmployerAdCtrl;
