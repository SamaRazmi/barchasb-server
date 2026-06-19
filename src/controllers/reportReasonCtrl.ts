// src/controllers/reportReasonCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

// تابع کمکی برای تبدیل params به string
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

export const getReportReasons = async (req: Request, res: Response) => {
  try {
    const { type = "general" } = req.query;
    const allowedTypes = [
      "general",
      "employerAd",
      "jobSeekerAd",
      "sellerAd",
      "DigitalAd",
      "chat_employerAd",
      "chat_jobSeekerAd",
      "chat_sellerAd",
      "chat_DigitalAd",
    ];
    const queryType = allowedTypes.includes(type as string)
      ? (type as string)
      : "general";

    let reasons = await prisma.reportReason.findMany({
      where: {
        type: queryType as any,
        isActive: true,
      },
      orderBy: { order: "asc" },
    });

    if (reasons.length === 0 && queryType !== "general") {
      reasons = await prisma.reportReason.findMany({
        where: {
          type: "general",
          isActive: true,
        },
        orderBy: { order: "asc" },
      });
    }
    res.json(reasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در دریافت لیست دلایل گزارش" });
  }
};

export const createReportReason = async (req: Request, res: Response) => {
  try {
    const { type, key, label, description, order, isActive } = req.body;
    if (!type || !key || !label || !description) {
      return res
        .status(400)
        .json({ error: "فیلدهای type, key, label, description اجباری هستند" });
    }

    const createdById = (req as any).user?.id;
    if (!createdById) {
      return res.status(401).json({ error: "کاربر احراز هویت نشده است" });
    }

    const newReason = await prisma.reportReason.create({
      data: {
        type: type as any,
        key,
        label,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        createdById,
      },
    });
    res.status(201).json(newReason);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "دلیل با این کلید و نوع قبلاً وجود دارد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در ایجاد دلیل گزارش" });
  }
};

export const updateReportReason = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "شناسه معتبر نیست" });
    }

    const updated = await prisma.reportReason.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "دلیل گزارش یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در بروزرسانی دلیل گزارش" });
  }
};

export const deleteReportReason = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "شناسه معتبر نیست" });
    }

    await prisma.reportReason.delete({
      where: { id },
    });
    res.json({ message: "دلیل گزارش حذف شد" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "دلیل گزارش یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در حذف دلیل گزارش" });
  }
};

// =================== export default ===================
const reportReasonCtrl = {
  getReportReasons,
  createReportReason,
  updateReportReason,
  deleteReportReason,
};

export default reportReasonCtrl;
