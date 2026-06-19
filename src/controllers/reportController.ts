import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createReport = async (req: Request, res: Response) => {
  try {
    const { targetId, reportType, reason, description } = req.body;

    // از req.user.id استفاده کنید (نه _id)
    const reporterUserId = (req as any).user?.id;

    if (!reporterUserId) {
      return res.status(401).json({ error: "کاربر احراز هویت نشده است" });
    }
    if (!targetId || !reportType || !reason || !description) {
      return res.status(400).json({ error: "اطلاعات ناقص است" });
    }

    const newReport = await prisma.report.create({
      data: {
        reporterUserId,
        targetId,
        reportType: reportType as any, // enum
        reason,
        description,
      },
    });

    res.status(201).json({ message: "گزارش شما با موفقیت ثبت شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ثبت گزارش" });
  }
};

// =================== export default ===================
const reportController = {
  createReport,
};

export default reportController;