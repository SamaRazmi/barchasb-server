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
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = {};

    // تشخیص نوع درخواست (JSON یا multipart/form-data)
    const isMultipart = req.headers["content-type"]?.includes(
      "multipart/form-data",
    );

    if (isMultipart) {
      // ========== پردازش FormData ==========
      updateData.title = req.body.title || "";
      updateData.description = req.body.description || "";
      updateData.digitalTotalDesc = req.body.digitalTotalDesc || "";
      updateData.minBudget = req.body.minBudget || "";
      updateData.maxBudget = req.body.maxBudget || "";
      updateData.person = req.body.person || "self";
      updateData.paymentMethod = req.body.paymentMethod || "Bank_card"; // ✅ پیش‌فرض صحیح
      updateData.requestType = req.body.requestType || "";
      updateData.durationUnit = req.body.durationUnit || "";
      updateData.durationAmount = req.body.durationAmount || "";
      updateData.verifyCode = req.body.verifyCode || "";

      updateData.remote =
        req.body.remote === "true" || req.body.remote === true;
      updateData.thursdayHalf =
        req.body.thursdayHalf === "true" || req.body.thursdayHalf === true;

      try {
        updateData.requiredSkills = req.body.requiredSkills
          ? JSON.parse(req.body.requiredSkills)
          : [];
        if (!Array.isArray(updateData.requiredSkills))
          updateData.requiredSkills = [];
      } catch {
        updateData.requiredSkills = [];
      }

      try {
        updateData.projectNames = req.body.projectNames
          ? JSON.parse(req.body.projectNames)
          : [];
        if (!Array.isArray(updateData.projectNames))
          updateData.projectNames = [];
      } catch {
        updateData.projectNames = [];
      }

      try {
        updateData.projectDescriptions = req.body.projectDescriptions
          ? JSON.parse(req.body.projectDescriptions)
          : [];
        if (!Array.isArray(updateData.projectDescriptions))
          updateData.projectDescriptions = [];
      } catch {
        updateData.projectDescriptions = [];
      }

      // ─── پردازش images ───
      let uploadedFiles = (req as any).files || [];
      if (uploadedFiles.length > 0) {
        uploadedFiles = transformFileUrls(uploadedFiles);
      }
      const images = uploadedFiles.map((file: any, i: number) => ({
        url: file.location || file.path || "",
        isMain: i === 0,
      }));
      updateData.images = images;
    } else {
      // ========== پردازش JSON ==========
      const body = req.body || {};
      Object.assign(updateData, body);

      // ✅ مقدار پیش‌فرض برای فیلدهای اجباری
      if (!updateData.title) {
        updateData.title = "عنوان پیش‌فرض";
      }
      if (!updateData.description) {
        updateData.description = "توضیحی وارد نشده است";
      }
      if (!updateData.images) {
        updateData.images = [];
      }
    }

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    // person
    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    // paymentMethod – تصحیح مقدار "Bank card" به "Bank_card"
    let payment = updateData.paymentMethod;
    if (payment === "Bank card") {
      payment = "Bank_card";
    }
    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (payment && !validPayment.includes(payment)) {
      payment = "Bank_card"; // ✅ پیش‌فرض ایمن
    }
    updateData.paymentMethod = payment || "Bank_card";

    // adStatus
    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus && !validStatus.includes(updateData.adStatus)) {
      updateData.adStatus = "pending";
    }

    // ─── فیلتر کردن داده‌ها ───
    const filteredData = filterAdData(updateData);

    console.log("📦 Final data to save:", filteredData);

    // ─── بررسی وجود owner ───
    const ownerId = (req as any).user?.id || req.body.owner;
    if (!ownerId) {
      return res
        .status(400)
        .json({ error: "شناسه کاربر (owner) ارسال نشده است" });
    }

    // بررسی وجود کاربر در دیتابیس (برای جلوگیری از خطای Foreign Key)
    const userExists = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true },
    });
    if (!userExists) {
      return res.status(404).json({ error: "کاربر مورد نظر یافت نشد" });
    }

    // ─── ساخت آگهی ───
    const ad = await prisma.digitalAd.create({
      data: {
        owner: ownerId,
        ...filteredData,
        adStatus: "pending_payment",
      },
    });

    console.log("✅ DigitalAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING DIGITAL AD:", err);
    // اگر خطای Foreign Key بود، پیام واضح‌تری بده
    if (err.code === "P2003") {
      return res.status(400).json({ error: "کاربر نامعتبر یا وجود ندارد" });
    }
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
        orderBy: { createdAt: "desc" },
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
                fullName:
                  `${ad.ownerRelation.name || ""} ${ad.ownerRelation.lastName || ""}`.trim(),
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
            fullName:
              `${(ad as any).ownerRelation.name || ""} ${(ad as any).ownerRelation.lastName || ""}`.trim(),
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
const DigitalAdCtrl = {
  createDigitalAd,
  getAllDigitalAds,
  getDigitalAdById,
};

export default DigitalAdCtrl;
