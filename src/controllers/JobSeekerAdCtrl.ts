import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls, transformS3Url } from "../middleware/upload";
import fs from "fs/promises";
import path from "path";

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
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = { ...req.body };

    // ─── پردازش عکس‌ها (همیشه آرایه) ───
    let uploadedImages = (req as any).files?.images || [];
    if (uploadedImages.length > 0) {
      uploadedImages = transformFileUrls(uploadedImages);
    }
    const images = uploadedImages.map((file: any, i: number) => ({
      url: file.location || file.path || "",
      isMain: i === 0,
    }));
    updateData.images = images;

    console.log("Processed images:", images);

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

    console.log("Final skills:", skills);

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

    // ─── فیلتر کردن داده‌ها (فقط فیلدهای مجاز) ───
    const filteredData = filterAdData(updateData);

    // ─── ساخت آگهی با owner ───
    const ad = await prisma.jobSeekerAd.create({
      data: {
        owner: (req as any).user?.id || req.body.owner,
        ...filteredData,
      },
    });

    console.log("✅ JobSeekerAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING JOB SEEKER AD:", err);

    if (err.code === "P2002" || err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
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
// 📌 دریافت همه آگهی‌های جوینده کار
// ==========================================
export const getAllJobSeekerAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.jobSeekerAd.findMany({
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

    res.json(formattedAds);
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

    const ads = await prisma.jobSeekerAd.findMany({
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
    console.error("❌ ERROR GETTING JOB SEEKER AD BY OWNER AND ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 📌 ویرایش آگهی (با اعتبارسنجی و پیش‌فرض)
// ==========================================
export const updateJobSeekerAd = async (req: Request, res: Response) => {
  try {
    const ownerId = toStr(req.params.ownerId);
    const adId = toStr(req.params.adId);

    if (!ownerId || !adId) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    // ─── تصاویر جدید ───
    let newUploadedFiles = (req as any).files || [];
    let newImages: any[] = [];
    if (newUploadedFiles.length > 0) {
      const transformed = transformFileUrls(newUploadedFiles);
      newImages = transformed.map((file: any) => ({
        url: file.location || file.path,
        isMain: false,
      }));
    }

    // ─── تصاویر قدیمی از فرانت ───
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

    // ─── پردازش skills ───
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

    // ─── اعتبارسنجی Enum ───
    const validPerson = ["self", "other"];
    if (updateData.person) {
      if (!validPerson.includes(updateData.person)) {
        updateData.person = "self";
        console.warn(`⚠️ person مقدار نامعتبر داشت، به "self" تغییر یافت`);
      }
    } else {
      updateData.person = "self";
    }

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

    const validStatus = ["pending", "approved", "rejected", "expired"];
    if (updateData.adStatus) {
      if (!validStatus.includes(updateData.adStatus)) {
        updateData.adStatus = "pending";
        console.warn(`⚠️ adStatus مقدار نامعتبر داشت، به "pending" تغییر یافت`);
      }
    } else {
      updateData.adStatus = "pending";
    }

    delete updateData.imagesFromApi;

    // ─── فیلتر کردن ───
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

    // حذف فایل‌های فیزیکی تصاویر (در صورت ذخیره محلی)
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
