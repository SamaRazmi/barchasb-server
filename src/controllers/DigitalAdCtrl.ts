import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { AdType } from "@prisma/client";

// ==========================================
// 📋 لیست فیلدهای مجاز در مدل DigitalAd
// ==========================================
const ALLOWED_FIELDS = [
  "owner",
  "title",
  "description",
  "digitalTotalDesc",
  "projectNames",
  "projectDescriptions",
  "minBudget",
  "maxBudget",
  "requiredSkills",
  "person",
  "remote",
  "thursdayHalf",
  "verifyCode",
  "paymentMethod",
  "adStatus",
  "requestType",
  "durationUnit",
  "durationAmount",
  "images",
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

// ==========================================
// 📌 ایجاد آگهی دیجیتال
// ==========================================
export const createDigitalAd = async (req: Request, res: Response) => {
  console.log("\n🚀 createDigitalAd START");
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = { ...req.body };

    // ─── پردازش images (همیشه آرایه) ───
    let uploadedFiles = (req as any).files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }
    const images = uploadedFiles.map((file: any, i: number) => ({
      url: file.location || file.path || "",
      isMain: i === 0,
    }));
    updateData.images = images;

    // ─── پردازش requiredSkills ───
    let requiredSkills = req.body.requiredSkills || [];
    if (typeof requiredSkills === "string") {
      try {
        requiredSkills = JSON.parse(requiredSkills);
        if (!Array.isArray(requiredSkills)) requiredSkills = [];
      } catch {
        requiredSkills = [];
      }
    }
    if (!Array.isArray(requiredSkills)) requiredSkills = [];
    updateData.requiredSkills = requiredSkills;

    // ─── پردازش projectNames و projectDescriptions ───
    let projectNames = req.body.projectNames || [];
    if (typeof projectNames === "string") {
      try {
        projectNames = JSON.parse(projectNames);
        if (!Array.isArray(projectNames)) projectNames = [];
      } catch {
        projectNames = [];
      }
    }
    if (!Array.isArray(projectNames)) projectNames = [];
    updateData.projectNames = projectNames;

    let projectDescriptions = req.body.projectDescriptions || [];
    if (typeof projectDescriptions === "string") {
      try {
        projectDescriptions = JSON.parse(projectDescriptions);
        if (!Array.isArray(projectDescriptions)) projectDescriptions = [];
      } catch {
        projectDescriptions = [];
      }
    }
    if (!Array.isArray(projectDescriptions)) projectDescriptions = [];
    updateData.projectDescriptions = projectDescriptions;

    // ─── تبدیل فیلدهای بولی ───
    const toBool = (v: any) => v === "true" || v === true;
    const BOOLEAN_FIELDS = ["remote", "thursdayHalf"];
    BOOLEAN_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = toBool(req.body[field]);
      }
    });

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    // person: فقط "self" یا "other" – پیش‌فرض "self"
    const validPerson = ["self", "other"];
    if (updateData.person) {
      if (!validPerson.includes(updateData.person)) {
        updateData.person = "self";
        console.warn(`⚠️ person مقدار نامعتبر داشت، به "self" تغییر یافت`);
      }
    } else {
      updateData.person = "self";
    }

    // paymentMethod: فقط "Subscription", "Wallet", "Bank_card" – پیش‌فرض "Subscription"
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

    // adStatus: فقط "pending", "approved", "rejected", "expired" – پیش‌فرض "pending"
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
    const ad = await prisma.digitalAd.create({
      data: {
        owner: (req as any).user?.id || req.body.owner,
        ...filteredData,
        adStatus: "pending_payment",
      },
    });

    console.log("✅ DigitalAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING DIGITAL AD:", err);
    res.status(400).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌ها
// ==========================================
export const getAllDigitalAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      prisma.digitalAd.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ownerRelation: {
            select: {
              name: true,
              lastName: true,
              phone: true,
              province: true,
              city: true,
            },
          },
        },
      }),
      prisma.digitalAd.count(),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.DigitalAd);

        return {
          ...ad,
          owner: ad.ownerRelation
            ? {
                fullName: `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
                phoneNumber: ad.ownerRelation.phone,
                province: ad.ownerRelation.province,
                city: ad.ownerRelation.city,
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
    console.error("❌ ERROR GETTING ALL DIGITAL ADS:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت یک آگهی دیجیتال
// ==========================================
export const getDigitalAdById = async (req: Request, res: Response) => {
  try {
    const id =
      typeof req.params.id === "string"
        ? req.params.id
        : req.params.id?.[0] || "";

    if (!id) {
      return res.status(400).json({ message: "شناسه آگهی معتبر نیست" });
    }

    const ad = await prisma.digitalAd.findUnique({
      where: { id },
      include: {
        ownerRelation: {
          select: {
            name: true,
            lastName: true,
            phone: true,
            province: true,
            city: true,
          },
        },
      },
    });

    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });

    const enhancement = await getAdEnhancement(ad.id, AdType.DigitalAd);

    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
            province: (ad as any).ownerRelation.province,
            city: (ad as any).ownerRelation.city,
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
    console.error("❌ ERROR GETTING DIGITAL AD BY ID:", err);
    res.status(500).json({ error: err.message });
  }
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

// =================== export default ===================
const DigitalAdCtrl = {
  createDigitalAd,
  getAllDigitalAds,
  getDigitalAdById,
};

export default DigitalAdCtrl;
