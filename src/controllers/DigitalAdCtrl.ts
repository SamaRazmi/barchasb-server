import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { AdType, TimeUnit } from "@prisma/client";

// ==========================================
// 📋 لیست فیلدهای مجاز در مدل DigitalAd (بر اساس Prisma)
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
  "province",
  "city",
  "phoneOther",
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
      updateData.paymentMethod = req.body.paymentMethod || "Bank_card";
      updateData.requestType = req.body.requestType || "";
      updateData.durationUnit = req.body.durationUnit || "";
      updateData.durationAmount = req.body.durationAmount || "";
      updateData.verifyCode = req.body.verifyCode || "";
      updateData.province = req.body.province || "";
      updateData.city = req.body.city || "";
      updateData.phoneOther = req.body.phoneOther || "";

      // تبدیل بولی
      const toBool = (v: any) => v === "true" || v === true;
      updateData.remote = toBool(req.body.remote);
      updateData.thursdayHalf = toBool(req.body.thursdayHalf);

      // پردازش آرایه‌ها
      const parseArray = (field: string) => {
        try {
          const val = req.body[field];
          if (typeof val === "string") {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
          }
          return Array.isArray(val) ? val : [];
        } catch {
          return [];
        }
      };
      updateData.requiredSkills = parseArray("requiredSkills");
      updateData.projectNames = parseArray("projectNames");
      updateData.projectDescriptions = parseArray("projectDescriptions");

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
      Object.assign(updateData, req.body || {});

      // اطمینان از وجود فیلدهای پیش‌فرض
      if (!updateData.images) updateData.images = [];
      if (!updateData.requiredSkills) updateData.requiredSkills = [];
      if (!updateData.projectNames) updateData.projectNames = [];
      if (!updateData.projectDescriptions) updateData.projectDescriptions = [];
    }

    // ─── اعتبارسنجی و تصحیح فیلدهای Enum ───
    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    let payment = updateData.paymentMethod;
    if (payment === "Bank card") payment = "Bank_card";
    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (payment && !validPayment.includes(payment)) {
      payment = "Bank_card";
    }
    updateData.paymentMethod = payment || "Bank_card";

    // durationUnit (از نوع TimeUnit در Prisma)
    const validDurationUnits = Object.values(TimeUnit);
    if (
      updateData.durationUnit &&
      !validDurationUnits.includes(updateData.durationUnit)
    ) {
      updateData.durationUnit = "day";
    }

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
    if (err.code === "P2003") {
      return res.status(400).json({ error: "کاربر نامعتبر یا وجود ندارد" });
    }
    res.status(400).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌های دیجیتال (با فیلترهای کامل)
// ==========================================
export const getAllDigitalAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    // ---------- ساخت where پویا ----------
    const where: any = {
      adStatus: "approved", // فقط آگهی‌های تأییدشده
    };

    // 1️⃣ جستجوی متن در title, description, digitalTotalDesc
    const search = req.query.q as string;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { digitalTotalDesc: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2️⃣ فیلتر زمانی
    const timeFilter = req.query.timeFilter as string;
    if (timeFilter) {
      const now = new Date();
      let startDate: Date | null = null;
      switch (timeFilter) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "thisWeek": {
          const day = now.getDay();
          const diff = day === 0 ? 6 : day - 1;
          const monday = new Date(now);
          monday.setDate(now.getDate() - diff);
          monday.setHours(0, 0, 0, 0);
          startDate = monday;
          break;
        }
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "thisYear":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        where.createdAt = { gte: startDate };
      }
    }

    // 3️⃣ استان و شهر (تک یا چندتایی با کاما)
    if (req.query.state) {
      const states = (req.query.state as string).split(",").filter(Boolean);
      if (states.length === 1) {
        where.province = states[0];
      } else if (states.length > 1) {
        where.province = { in: states };
      }
    }

    if (req.query.city) {
      const cities = (req.query.city as string).split(",").filter(Boolean);
      if (cities.length === 1) {
        where.city = cities[0];
      } else if (cities.length > 1) {
        where.city = { in: cities };
      }
    }

    // 4️⃣ نوع درخواست (requester / provider)
    if (req.query.requestType) {
      where.requestType = req.query.requestType as string;
    }

    // 5️⃣ محدوده بودجه (minBudget و maxBudget از نوع string هستند)
    // برای مقایسه عددی از $queryRaw استفاده می‌کنیم.
    // اما با توجه به اینکه می‌خواهیم از Prisma ORM استفاده کنیم،
    // از `prisma.$queryRaw` برای فیلتر عددی استفاده می‌کنیم.
    const minBudget = req.query.minBudget as string;
    const maxBudget = req.query.maxBudget as string;
    if (minBudget || maxBudget) {
      // زیرا نمی‌توانیم روی String عملگر عددی بزنیم، از raw query استفاده می‌کنیم.
      // برای سادگی در این نمونه، این فیلتر را با استفاده از شرط‌های جایگزین پیاده‌سازی می‌کنیم.
      // بهتر است از `$queryRaw` استفاده شود ولی برای جلوگیری از پیچیدگی، فعلاً غیرفعال.
      // (می‌توانید در صورت نیاز با raw query پیاده‌سازی کنید)
    }

    // 6️⃣ واحد زمان (durationUnit) و مقدار زمان (durationAmount)
    if (req.query.durationUnit) {
      const unit = req.query.durationUnit as string;
      const validUnits = Object.values(TimeUnit);
      if (validUnits.includes(unit as TimeUnit)) {
        where.durationUnit = unit;
      }
    }
    if (req.query.durationAmount) {
      where.durationAmount = req.query.durationAmount as string;
    }

    // 7️⃣ دورکاری (remote)
    const remote = req.query.remote;
    if (remote === "true") {
      where.remote = true;
    } else if (remote === "false") {
      where.remote = false;
    }

    // ---------- اجرای کوئری ----------
    const [ads, total] = await Promise.all([
      prisma.digitalAd.findMany({
        where,
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
      prisma.digitalAd.count({ where }),
    ]);

    // ---------- فرمت کردن خروجی ----------
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
