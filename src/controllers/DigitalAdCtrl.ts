import { Request, Response } from "express";
import prisma from "../config/prisma";
import { transformFileUrls } from "../middleware/upload";

// ایجاد آگهی دیجیتال
export const createDigitalAd = async (req: Request, res: Response) => {
  try {
    // تبدیل آدرس تصاویر به دامنه سفارشی
    let uploadedFiles = (req as any).files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }

    const images = uploadedFiles.map((file: any, i: number) => ({
      url: file.location || file.path,
      isMain: i === 0,
    }));

    let requiredSkills = req.body.requiredSkills || [];
    if (typeof requiredSkills === "string") {
      try {
        requiredSkills = JSON.parse(requiredSkills.trim());
        if (!Array.isArray(requiredSkills)) requiredSkills = [];
      } catch {
        requiredSkills = [];
      }
    }

    const ad = await prisma.digitalAd.create({
      data: {
        ...req.body,
        images,
        requiredSkills,
      },
    });

    res.status(201).json(ad);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// دریافت همه آگهی‌ها
export const getAllDigitalAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.digitalAd.findMany({
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

    // تبدیل به فرمت قبلی که populate("owner", "fullName") داشت
    const formattedAds = (ads as any[]).map((ad) => ({
      ...ad,
      owner: ad.ownerRelation
        ? {
            fullName: `${ad.ownerRelation.name || ""} ${
              ad.ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: ad.ownerRelation.phone,
            province: ad.ownerRelation.province,
            city: ad.ownerRelation.city,
          }
        : null,
      ownerRelation: undefined, // حذف فیلد اضافی
    }));

    res.json(formattedAds);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// دریافت یک آگهی دیجیتال
export const getDigitalAdById = async (req: Request, res: Response) => {
  try {
    // تبدیل req.params.id به string
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

    // تبدیل به فرمت قبلی که populate("owner", "fullName phoneNumber province city") داشت
    const formattedAd = {
      ...(ad as any),
      owner: (ad as any).ownerRelation
        ? {
            fullName: `${(ad as any).ownerRelation.name || ""} ${
              (ad as any).ownerRelation.lastName || ""
            }`.trim(),
            phoneNumber: (ad as any).ownerRelation.phone,
            province: (ad as any).ownerRelation.province,
            city: (ad as any).ownerRelation.city,
          }
        : null,
      ownerRelation: undefined,
    };

    res.json(formattedAd);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =================== export default ===================
const DigitalAdCtrl = {
  createDigitalAd,
  getAllDigitalAds,
  getDigitalAdById,
};

export default DigitalAdCtrl;
