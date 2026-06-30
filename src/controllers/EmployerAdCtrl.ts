import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";
import { promises as fs } from "fs";
import path from "path";

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
  console.log("Body received:", req.body);
  console.log("Files received:", (req as any).files);

  try {
    const updateData: any = { ...req.body };

    // ─── بررسی فیلد اجباری name ───
    if (!updateData.name) {
      return res.status(400).json({ error: "فیلد name اجباری است" });
    }

    // ─── پردازش images (همیشه آرایه) ───
    let uploadedImages = (req as any).files?.images || [];
    if (uploadedImages.length > 0) {
      uploadedImages = transformFileUrls(uploadedImages);
    }
    const images = uploadedImages.map((file: any, i: number) => ({
      url: file.location || file.path || "",
      isMain: i === 0,
    }));
    updateData.images = images;

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
    updateData.categories = categories;

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
    updateData.jobDetails = jobDetails;

    // ─── تبدیل فیلدهای بولی ───
    const BOOLEAN_FIELDS = [
      "isRemote",
      "thursdayUntilNoon",
      "enableChat",
      "enablePhone",
      "isVerified",
    ];
    const toBool = (v: any) => v === "true" || v === true;
    BOOLEAN_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = toBool(req.body[field]);
        delete req.body[field];
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

    // adPaymentMethod: فقط "Subscription", "Wallet", "Bank_card" – پیش‌فرض "Subscription"
    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (updateData.adPaymentMethod) {
      if (!validPayment.includes(updateData.adPaymentMethod)) {
        updateData.adPaymentMethod = "Subscription";
        console.warn(
          `⚠️ adPaymentMethod مقدار نامعتبر داشت، به "Subscription" تغییر یافت`,
        );
      }
    } else {
      updateData.adPaymentMethod = "Subscription";
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
    const ad = await prisma.employerAd.create({
      data: {
        owner: (req as any).user?.id || req.body.owner,
        ...filteredData,
      },
    });

    console.log("✅ EmployerAd created successfully");
    res.status(201).json(ad);
  } catch (err: any) {
    console.error("❌ ERROR CREATING EMPLOYER AD:", err);
    res.status(400).json({ error: err.message });
  }
};

// ==========================================
// 📌 دریافت همه آگهی‌ها
// ==========================================
export const getAllEmployerAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.employerAd.findMany({
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

    const ads = await prisma.employerAd.findMany({
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

    // adPaymentMethod: فقط "Subscription", "Wallet", "Bank_card" – پیش‌فرض "Subscription"
    const validPayment = ["Subscription", "Wallet", "Bank_card"];
    if (updateData.adPaymentMethod) {
      if (!validPayment.includes(updateData.adPaymentMethod)) {
        updateData.adPaymentMethod = "Subscription";
        console.warn(
          `⚠️ adPaymentMethod مقدار نامعتبر داشت، به "Subscription" تغییر یافت`,
        );
      }
    } else {
      updateData.adPaymentMethod = "Subscription";
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
