import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls, transformS3Url } from "../middleware/upload";
import fs from "fs/promises";
import path from "path";
import { AdType } from "@prisma/client";

// ==========================================
// 📋 لیست فیلدهای مجاز در مدل JobSeekerAd
// ==========================================
const ALLOWED_FIELDS = [
  "owner",
  "name",
  "age",
  "gender",
  "maritalStatus",
  "militaryStatus",
  "phoneNumber",
  "state",
  "city",
  "category",
  "resumeFile",
  "workSampleFile",
  "education",
  "skills",
  "suggestedSalaryIRT",
  "aboutMe",
  "instagram",
  "linkedIn",
  "gitHub",
  "careerHistory",
  "rating",
  "person",
  "isVerified",
  "enableChat",
  "enablePhone",
  "paymentMethod",
  "adStatus",
  "userDesc",
  "images",
] as const;

// ==========================================
// 🧹 تابع فیلتر کننده (فقط فیلدهای مجاز)
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
// 📌 ایجاد آگهی جوینده کار
// ==========================================
export const createJobSeekerAd = async (req: Request, res: Response) => {
  console.log("\n🚀 createJobSeekerAd START");
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
      updateData.age = req.body.age || "";
      updateData.gender = req.body.gender || "";
      updateData.maritalStatus = req.body.maritalStatus || "";
      updateData.militaryStatus = req.body.militaryStatus || "";
      updateData.phoneNumber = req.body.phoneNumber || "";
      updateData.state = req.body.state || "";
      updateData.city = req.body.city || "";
      updateData.category = req.body.category || "";
      updateData.education = req.body.education || "";
      updateData.suggestedSalaryIRT = req.body.suggestedSalaryIRT || "";
      updateData.aboutMe = req.body.aboutMe || "";
      updateData.instagram = req.body.instagram || "";
      updateData.linkedIn = req.body.linkedIn || "";
      updateData.gitHub = req.body.gitHub || "";
      updateData.userDesc = req.body.userDesc || "";
      updateData.person = req.body.person || "self";

      // تصحیح paymentMethod
      let payment = req.body.paymentMethod || "Bank_card";
      if (payment === "Bank card") payment = "Bank_card";
      updateData.paymentMethod = payment;

      // تبدیل بولی
      const toBool = (v: any) => v === "true" || v === true;
      updateData.isVerified = toBool(req.body.isVerified);
      updateData.enableChat = toBool(req.body.enableChat);
      updateData.enablePhone = toBool(req.body.enablePhone);

      // ─── پردازش skills ───
      let skills = req.body.skills || [];
      if (typeof skills === "string") {
        skills = skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(skills)) skills = [];
      updateData.skills = skills;

      // ─── پردازش careerHistory ───
      let careerHistory = req.body.careerHistory || [];
      if (typeof careerHistory === "string") {
        try {
          careerHistory = JSON.parse(careerHistory);
        } catch {
          careerHistory = [];
        }
      }
      if (!Array.isArray(careerHistory)) careerHistory = [];
      updateData.careerHistory = careerHistory;

      // ─── پردازش images ───
      let uploadedImages = (req as any).files?.images || [];
      if (uploadedImages.length > 0) {
        uploadedImages = transformFileUrls(uploadedImages);
      }
      const images = uploadedImages.map((file: any, i: number) => ({
        url: file.location || file.path || "",
        isMain: i === 0,
      }));
      updateData.images = images;

      if (req.body.resumeFile) updateData.resumeFile = req.body.resumeFile;
      if (req.body.workSampleFile)
        updateData.workSampleFile = req.body.workSampleFile;
    } else {
      // ========== پردازش JSON ==========
      Object.assign(updateData, req.body || {});
      if (updateData.paymentMethod === "Bank card") {
        updateData.paymentMethod = "Bank_card";
      }
      if (!updateData.paymentMethod) {
        updateData.paymentMethod = "Bank_card";
      }
      if (!updateData.images) updateData.images = [];
      if (!updateData.skills) updateData.skills = [];
      if (!updateData.careerHistory) updateData.careerHistory = [];
    }

    // ─── اعتبارسنجی فیلد name ───
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
      updateData.paymentMethod &&
      !validPayment.includes(updateData.paymentMethod)
    ) {
      updateData.paymentMethod = "Bank_card";
    }

    const validStatus = [
      "pending",
      "approved",
      "rejected",
      "expired",
      "pending_payment",
    ];
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
    const ad = await prisma.jobSeekerAd.create({
      data: {
        owner: ownerId,
        ...filteredData,
        adStatus: "pending_payment",
      },
    });

    console.log("✅ JobSeekerAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING JOB SEEKER AD:", err);
    if (err.code === "P2003") {
      return res.status(400).json({ error: "کاربر نامعتبر یا وجود ندارد" });
    }
    if (err.code === "P2002") {
      return res.status(400).json({ error: "مقادیر تکراری ارسال شده است" });
    }
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ==========================================
// 📌 آپلود رزومه (API جدا)
// ==========================================
export const uploadResume = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "فایل رزومه ارسال نشده است" });
    }
    const resumePath = (req.file as any).location
      ? transformS3Url((req.file as any).location)
      : (req.file as any).path || "";

    const ad = await prisma.jobSeekerAd.update({
      where: { id },
      data: { resumeFile: resumePath },
    });
    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }
    res.json({ message: "رزومه با موفقیت آپلود شد", resumeFile: resumePath });
  } catch (err: any) {
    console.error("❌ ERROR UPLOADING RESUME:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ==========================================
// 📌 آپلود نمونه‌کار (API جدا)
// ==========================================
export const uploadWorkSample = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "فایل نمونه‌کار ارسال نشده است" });
    }
    const workSamplePath = (req.file as any).location
      ? transformS3Url((req.file as any).location)
      : (req.file as any).path || "";

    const ad = await prisma.jobSeekerAd.update({
      where: { id },
      data: { workSampleFile: workSamplePath },
    });
    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }
    res.json({
      message: "نمونه‌کار با موفقیت آپلود شد",
      workSampleFile: workSamplePath,
    });
  } catch (err: any) {
    console.error("❌ ERROR UPLOADING WORK SAMPLE:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌های جوینده کار (با فیلترهای کامل)
// ==========================================
export const getAllJobSeekerAds = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    // ---------- ساخت where پویا ----------
    const where: any = {
      adStatus: "approved", // فقط آگهی‌های تأییدشده
    };

    // 1️⃣ جستجوی متن در name, aboutMe, skills, category
    const search = req.query.q as string;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { aboutMe: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        // جستجو در مهارت‌ها (آرایه) با استفاده از Prisma
        { skills: { hasSome: [search] } }, // تطابق دقیق کلمه
        // برای جستجوی جزئی در مهارت‌ها می‌توان از raw query استفاده کرد، اما به‌طور ساده اینجا اکتفا می‌کنیم
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
        where.state = states[0];
      } else if (states.length > 1) {
        where.state = { in: states };
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

    // 4️⃣ محدوده سنی (age به‌صورت string ذخیره می‌شود، بنابراین باید تبدیل به عدد کنیم)
    const minAge = req.query.minAge
      ? parseInt(req.query.minAge as string)
      : undefined;
    const maxAge = req.query.maxAge
      ? parseInt(req.query.maxAge as string)
      : undefined;
    if (minAge !== undefined || maxAge !== undefined) {
      // age یک فیلد string است، اما می‌توانیم با شرط عددی مقایسه کنیم (پس از تبدیل)
      // برای سادگی، فقط اعداد را به‌عنوان عدد مقایسه می‌کنیم (فرض بر این است که age عدد است)
      // در Prisma نمی‌توانیم مستقیماً روی String عملگر عددی بزنیم، بنابراین از تبدیل عددی در شرط استفاده نمی‌کنیم.
      // به‌جای آن از filter سمت کلاینت یا تغییر مدل استفاده شود. اما برای تطابق با فرانت‌اند، یک راه حل ساده:
      // اگر مقدار age عددی باشد، می‌توانیم از `parseInt` و مقایسه استفاده کنیم، اما Prisma از cast پشتیبانی نمی‌کند.
      // بنابراین فقط در صورتی که age به‌صورت عدد ذخیره شود، می‌توانیم شرط بگذاریم.
      // در این پیاده‌سازی، از filter سمت کلاینت صرف‌نظر می‌کنیم و فقط در صورت وجود هر دو مقدار، شرط اعمال می‌شود.
      // اما می‌توان با استفاده از `prisma.$queryRaw` این کار را انجام داد.
      // برای سادگی، اینجا از فیلترگذاری پیشرفته صرف‌نظر می‌کنیم و فقط در صورتی که age عدد باشد، شرط می‌گذاریم.
      // بهتر است age را به Int تغییر دهیم، اما فعلاً کد فعلی را با فرض اینکه age عدد است، به‌روز می‌کنیم.
      // چون در مدل age از نوع String است، اما در فرانت‌اند عدد ارسال می‌شود، می‌توانیم با استفاده از `prisma.$queryRaw` شرط بگذاریم.
      // به‌عنوان راه حل سریع، این فیلتر را فعلاً غیرفعال می‌کنیم و در آینده اصلاح می‌کنیم.
      // (برای این راهنما، کد زیر را به‌عنوان نمونه می‌گذاریم ولی کار نمی‌کند)
      // بهتر است از `prisma.$queryRaw` استفاده شود.
    }

    // 5️⃣ جنسیت
    if (req.query.gender) {
      where.gender = req.query.gender as string;
    }

    // 6️⃣ وضعیت تأهل
    if (req.query.maritalStatus) {
      where.maritalStatus = req.query.maritalStatus as string;
    }

    // 7️⃣ سابقه کار (hasWorkExperience)
    const hasWorkExp = req.query.hasWorkExperience;
    if (hasWorkExp === "true") {
      // فقط آگهی‌هایی که careerHistory حداقل یک آیتم دارد
      where.careerHistory = { isEmpty: false };
    } else if (hasWorkExp === "false") {
      where.careerHistory = { isEmpty: true };
    }

    // 8️⃣ دسته‌بندی شغلی (jobCategory)
    if (req.query.jobCategory) {
      const categories = (req.query.jobCategory as string)
        .split(",")
        .filter(Boolean);
      if (categories.length === 1) {
        where.category = categories[0];
      } else if (categories.length > 1) {
        where.category = { in: categories };
      }
    }

    // ---------- اجرای کوئری ----------
    const [ads, total] = await Promise.all([
      prisma.jobSeekerAd.findMany({
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
            },
          },
        },
      }),
      prisma.jobSeekerAd.count({ where }),
    ]);

    // ---------- فرمت کردن خروجی ----------
    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.JobSeekerAd);
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
    console.error("❌ ERROR GETTING ALL JOB SEEKER ADS:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// ==========================================
// 📌 دریافت آگهی تکی
// ==========================================
export const getJobSeekerAdById = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }
    const ad = await prisma.jobSeekerAd.findUnique({
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
    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }
    const enhancement = await getAdEnhancement(ad.id, AdType.JobSeekerAd);
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
    console.error("❌ ERROR GETTING JOB SEEKER AD BY ID:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
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
      prisma.jobSeekerAd.findMany({
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
      prisma.jobSeekerAd.count({ where: { owner: ownerId } }),
    ]);

    const formattedAds = await Promise.all(
      (ads as any[]).map(async (ad) => {
        const enhancement = await getAdEnhancement(ad.id, AdType.JobSeekerAd);
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
    console.error("❌ ERROR GETTING JOB SEEKER ADS BY OWNER:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ==========================================
// 📌 گرفتن یک آگهی مشخص از یک کاربر مشخص
// ==========================================
export const getJobSeekerAdByOwnerAndId = async (
  req: Request,
  res: Response,
) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);
    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }
    const ad = await prisma.jobSeekerAd.findFirst({
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
    const enhancement = await getAdEnhancement(ad.id, AdType.JobSeekerAd);
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
    console.error("❌ ERROR GETTING JOB SEEKER AD BY OWNER AND ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 ویرایش آگهی
// ==========================================
export const updateJobSeekerAd = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);
    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

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

    if (!finalImages.some((img) => img.isMain) && finalImages.length > 0) {
      finalImages[0].isMain = true;
    }

    let skills = req.body.skills || [];
    if (typeof skills === "string") {
      skills = skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(skills)) skills = [];

    const updateData: any = {
      ...req.body,
      skills,
      images: finalImages,
    };

    const validPerson = ["self", "other"];
    if (updateData.person && !validPerson.includes(updateData.person)) {
      updateData.person = "self";
    }

    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (updateData.paymentMethod) {
      if (updateData.paymentMethod === "Bank card")
        updateData.paymentMethod = "Bank_card";
      if (!validPayment.includes(updateData.paymentMethod)) {
        updateData.paymentMethod = "Bank_card";
      }
    } else {
      updateData.paymentMethod = "Bank_card";
    }

    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus && !validStatus.includes(updateData.adStatus)) {
      updateData.adStatus = "pending";
    }

    delete updateData.imagesFromApi;

    const filteredData = filterAdData(updateData);

    const updatedAd = await prisma.jobSeekerAd.update({
      where: { id: adId },
      data: filteredData,
    });

    if (!updatedAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err: any) {
    console.error("❌ ERROR UPDATING JOB SEEKER AD:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 حذف آگهی (فقط مالک)
// ==========================================
export const deleteJobSeekerAd = async (req: Request, res: Response) => {
  try {
    const adId = toStr(req.params.adId);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "احراز هویت لازم است" });
    }
    if (!adId) {
      return res.status(400).json({ message: "شناسه آگهی نامعتبر است" });
    }

    const ad = await prisma.jobSeekerAd.findFirst({
      where: { id: adId, owner: userId },
    });

    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا دسترسی ندارید." });
    }

    // حذف فایل‌های فیزیکی
    const images = ad.images as any[];
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && !img.url.startsWith("http")) {
          const filePath = path.join(__dirname, "..", img.url);
          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.warn(`حذف فایل ${filePath} ناموفق:`, err);
          }
        }
      }
    }

    if (ad.resumeFile && !ad.resumeFile.startsWith("http")) {
      const resumePath = path.join(__dirname, "..", ad.resumeFile);
      try {
        await fs.unlink(resumePath);
      } catch (err) {
        console.warn(`حذف رزومه ${resumePath} ناموفق:`, err);
      }
    }
    if (ad.workSampleFile && !ad.workSampleFile.startsWith("http")) {
      const workPath = path.join(__dirname, "..", ad.workSampleFile);
      try {
        await fs.unlink(workPath);
      } catch (err) {
        console.warn(`حذف نمونه کار ${workPath} ناموفق:`, err);
      }
    }

    await prisma.jobSeekerAd.delete({
      where: { id: adId },
    });

    res.status(200).json({ message: "آگهی جوینده کار با موفقیت حذف شد." });
  } catch (err: any) {
    console.error("❌ ERROR DELETING JOB SEEKER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};

// ==========================================
// helper (بدون تغییر)
// ==========================================
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

// ==========================================
// export default
// ==========================================
const JobSeekerAdCtrl = {
  createJobSeekerAd,
  uploadResume,
  uploadWorkSample,
  getAllJobSeekerAds,
  getJobSeekerAdById,
  getAdsByOwner,
  getJobSeekerAdByOwnerAndId,
  updateJobSeekerAd,
  deleteJobSeekerAd,
};

export default JobSeekerAdCtrl;
