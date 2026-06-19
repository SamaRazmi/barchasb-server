import { Request, Response } from "express";
import prisma from "../config/prisma";
import * as dateFormatter from "../utils/dateFormatter";
import { uploadToLiara } from "../utils/s3Upload";

// ====== تابع کمکی برای تبدیل params به string ======
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// =================== CONTROLLER FUNCTIONS ===================

export const getResumeData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "احراز هویت نشده" });

    const id = toStr(req.params.id);
    if (!id) return res.status(400).json({ message: "شناسه رزومه معتبر نیست" });

    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });
    if (!resume) return res.status(404).json({ message: "رزومه یافت نشد" });
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت رزومه" });
  }
};

export const saveResumeData = async (req: Request, res: Response) => {
  try {
    const { resumeId, ...resumeData } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(400).json({ message: "آیدی کاربر در توکن یافت نشد." });
    }

    if (resumeId) {
      // ویرایش رزومه موجود
      const existingResume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });
      if (!existingResume)
        return res.status(404).json({ message: "رزومه یافت نشد." });

      if (existingResume.userId !== userId) {
        return res
          .status(403)
          .json({ message: "شما اجازه ویرایش این رزومه را ندارید." });
      }

      if (existingResume.updateCount >= 3) {
        return res.status(403).json({
          message: "محدودیت ویرایش (حداکثر ۳ بار) به پایان رسیده است.",
        });
      }

      const updatedResume = await prisma.resume.update({
        where: { id: resumeId },
        data: {
          ...resumeData,
          updateCount: { increment: 1 },
        },
      });

      return res.status(200).json({ message: "رزومه آپدیت شد." });
    } else {
      // ساخت رزومه جدید
      const newResume = await prisma.resume.create({
        data: {
          userId,
          ...resumeData,
        },
      });

      return res.status(201).json({
        message: "رزومه ایجاد شد.",
        resumeId: newResume.id,
      });
    }
  } catch (error) {
    console.error("Error saving resume data:", error);
    res.status(500).json({ message: "خطای سرور در ذخیره اطلاعات." });
  }
};

export const getResumeUrl = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "احراز هویت نشده" });

    const id = toStr(req.params.id);
    if (!id) return res.status(400).json({ message: "شناسه رزومه معتبر نیست" });

    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });
    if (!resume || !resume.fileUrl)
      return res.status(404).json({ message: "فایلی یافت نشد" });
    res.status(200).json({ fileUrl: resume.fileUrl });
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت لینک" });
  }
};

export const uploadResumeFile = async (req: Request, res: Response) => {
  try {
    const resumeId = toStr(req.params.resumeId);
    const file = (req as any).file;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ message: "احراز هویت نشده" });
    if (!resumeId)
      return res.status(400).json({ message: "شناسه رزومه نامعتبر است" });

    if (!file) {
      return res
        .status(400)
        .json({ message: "فایلی ارسال نشده یا فرمت آن PDF نیست." });
    }

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });
    if (!resume) {
      return res.status(404).json({ message: "رزومه یافت نشد." });
    }

    const fileUrl = await uploadToLiara(file, userId);

    await prisma.resume.update({
      where: { id: resumeId },
      data: { fileUrl },
    });

    res.status(200).json({ message: "فایل با موفقیت آپلود شد.", fileUrl });
  } catch (error: any) {
    console.error("Error uploading resume file:", error);
    if (error.message === "فقط فایل‌های PDF مجاز هستند.") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "خطای سرور در آپلود فایل." });
  }
};

// =================== USER PROFILE ===================

export const getMyResumes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "احراز هویت نشده" });

    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        updateCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!resumes || resumes.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "رزومه‌ای یافت نشد.", resumes: [] });
    }

    const formattedResumes = resumes.map((resume) => ({
      ...resume,
      createdAt: dateFormatter.toJalali(resume.createdAt),
      updatedAt: dateFormatter.toJalali(resume.updatedAt),
    }));

    res.status(200).json({ success: true, resumes: formattedResumes });
  } catch (error) {
    console.error("Error getting user resumes:", error);
    res
      .status(500)
      .json({ success: false, message: "خطای سرور در دریافت لیست رزومه‌ها." });
  }
};

// =================== ADMIN ===================

export const getUsersWithResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await prisma.resume.findMany({
      select: {
        id: true,
        userId: true,
        updateCount: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const userMap: Record<
      string,
      {
        totalResumes: number;
        lastUserUpdate: Date;
        resumes: Array<{
          resumeId: string;
          updateCount: number;
          updatedAt: Date;
        }>;
      }
    > = {};

    for (const resume of resumes) {
      const userId = resume.userId;
      if (!userMap[userId]) {
        userMap[userId] = {
          totalResumes: 0,
          lastUserUpdate: resume.updatedAt,
          resumes: [],
        };
      }
      userMap[userId].totalResumes += 1;
      if (resume.updatedAt > userMap[userId].lastUserUpdate) {
        userMap[userId].lastUserUpdate = resume.updatedAt;
      }
      userMap[userId].resumes.push({
        resumeId: resume.id,
        updateCount: resume.updateCount,
        updatedAt: resume.updatedAt,
      });
    }

    const result = Object.keys(userMap).map((userId) => ({
      userId,
      totalResumes: userMap[userId].totalResumes,
      lastUserUpdate: dateFormatter.toJalali(userMap[userId].lastUserUpdate),
      resumes: userMap[userId].resumes.map((r) => ({
        ...r,
        updatedAt: dateFormatter.toJalali(r.updatedAt),
      })),
    }));

    result.sort(
      (a, b) =>
        new Date(b.lastUserUpdate).getTime() -
        new Date(a.lastUserUpdate).getTime(),
    );

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching users with resumes:", error);
    res
      .status(500)
      .json({ success: false, message: "خطا در دریافت کاربران دارای رزومه." });
  }
};

// =================== EXPORT DEFAULT ===================
const ResumeCtrl = {
  getResumeData,
  saveResumeData,
  getResumeUrl,
  uploadResumeFile,
  getMyResumes,
  getUsersWithResumes,
};

export default ResumeCtrl;
