// src/controllers/UploadFileCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
// import UserProfile from "../models/UserProfile.js"; // کامنت شده (قبلاً استفاده می‌شد)

/**
 * آپلود یک فایل PDF یا Word
 */
export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "فایلی ارسال نشده" });
    }

    // مثال: ذخیره در UserProfile (اختیاری) - با Prisma
    // const profile = await prisma.userProfile.upsert({
    //   where: { user: (req as any).user.id },
    //   update: { resumeFile: (req.file as any).location },
    //   create: { user: (req as any).user.id, resumeFile: (req.file as any).location },
    // });

    res.status(200).json({
      msg: "فایل با موفقیت آپلود شد",
      fileUrl: (req.file as any).location,
      originalName: req.file.originalname,
      // profile,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

/**
 * آپلود چند فایل PDF یا Word
 */
export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    const files = (req.files as any[]) || [];

    if (!files.length) {
      return res.status(400).json({ msg: "فایلی ارسال نشده" });
    }

    const uploadedFiles = files.map((f) => ({
      fileUrl: f.location,
      originalName: f.originalname,
    }));

    // مثال: ذخیره در UserProfile (اختیاری) - با Prisma
    // const profile = await prisma.userProfile.upsert({
    //   where: { user: (req as any).user.id },
    //   update: {
    //     portfolioFiles: {
    //       push: uploadedFiles.map(f => f.fileUrl)
    //     }
    //   },
    //   create: {
    //     user: (req as any).user.id,
    //     portfolioFiles: uploadedFiles.map(f => f.fileUrl)
    //   },
    // });

    res.status(200).json({
      msg: "فایل‌ها با موفقیت آپلود شدند",
      files: uploadedFiles,
      // profile,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

// =================== export default ===================
const UploadFileCtrl = {
  uploadSingleFile,
  uploadMultipleFiles,
};

export default UploadFileCtrl;