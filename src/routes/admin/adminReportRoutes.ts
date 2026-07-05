import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ReportStatus, ReportType } from "@prisma/client";

// ===== تابع کمکی برای تبدیل پارامترها به string =====
const toStr = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === "string") return first;
  }
  return undefined;
};

// ===== تابع کمکی برای دریافت اطلاعات کامل target (آگهی یا چت) =====
const getTargetDetails = async (targetId: string, reportType: ReportType) => {
  switch (reportType) {
    case "employerAd":
      return await prisma.employerAd.findUnique({
        where: { id: targetId },
        include: {
          ownerRelation: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      });
    case "jobSeekerAd":
      return await prisma.jobSeekerAd.findUnique({
        where: { id: targetId },
        include: {
          ownerRelation: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      });
    case "sellerAd":
      return await prisma.sellerAd.findUnique({
        where: { id: targetId },
        include: {
          ownerRelation: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      });
    case "DigitalAd":
      return await prisma.digitalAd.findUnique({
        where: { id: targetId },
        include: {
          ownerRelation: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      });
    case "chat":
      const chat = await prisma.chat.findUnique({
        where: { id: targetId },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
          conversation: {
            include: {
              chats: {
                orderBy: { createdAt: "asc" },
                include: {
                  fromUser: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                      email: true,
                    },
                  },
                  toUser: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!chat) return null;
      return chat;
    default:
      return null;
  }
};

// ===== ۱. دریافت لیست تمام گزارش‌ها (با فیلتر و صفحه‌بندی) =====
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const { status, reportType, page = "1", limit = "20" } = req.query;

    const statusStr = toStr(status);
    const reportTypeStr = toStr(reportType);
    const pageStr = toStr(page) || "1";
    const limitStr = toStr(limit) || "20";

    const pageNum = parseInt(pageStr) || 1;
    const limitNum = parseInt(limitStr) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (statusStr) where.status = statusStr as ReportStatus;
    if (reportTypeStr) where.reportType = reportTypeStr as ReportType;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در دریافت لیست گزارش‌ها" });
  }
};

// ===== ۲. دریافت جزئیات کامل یک گزارش (همراه target و گزارش‌دهنده) =====
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = toStr(id);
    if (!idStr) {
      return res.status(400).json({ error: "شناسه گزارش الزامی است" });
    }

    const report = await prisma.report.findUnique({
      where: { id: idStr },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ error: "گزارش یافت نشد" });
    }

    const targetDetails = await getTargetDetails(
      report.targetId,
      report.reportType,
    );

    res.json({
      report,
      target: targetDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در دریافت جزئیات گزارش" });
  }
};

// ===== ۳. تغییر وضعیت گزارش =====
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = toStr(id);
    if (!idStr) {
      return res.status(400).json({ error: "شناسه گزارش معتبر نیست" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "وضعیت جدید الزامی است" });
    }
    if (!["pending", "reviewed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "وضعیت نامعتبر است" });
    }

    const updated = await prisma.report.update({
      where: { id: idStr },
      data: { status: status as ReportStatus },
    });

    res.json({ message: "وضعیت گزارش به‌روز شد", report: updated });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "گزارش یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در بروزرسانی وضعیت" });
  }
};

// ===== ۴. حذف گزارش (اختیاری) =====
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = toStr(id);
    if (!idStr) {
      return res.status(400).json({ error: "شناسه گزارش معتبر نیست" });
    }

    await prisma.report.delete({ where: { id: idStr } });
    res.json({ message: "گزارش با موفقیت حذف شد" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "گزارش یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در حذف گزارش" });
  }
};

// ===== ۵. حذف آگهی بر اساس گزارش =====
export const deleteAdByReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = toStr(id);
    if (!idStr) {
      return res.status(400).json({ error: "شناسه گزارش معتبر نیست" });
    }

    const report = await prisma.report.findUnique({
      where: { id: idStr },
    });

    if (!report) {
      return res.status(404).json({ error: "گزارش یافت نشد" });
    }

    const { targetId, reportType } = report;
    let deleted = false;

    switch (reportType) {
      case "employerAd":
        await prisma.employerAd.delete({ where: { id: targetId } });
        deleted = true;
        break;
      case "jobSeekerAd":
        await prisma.jobSeekerAd.delete({ where: { id: targetId } });
        deleted = true;
        break;
      case "sellerAd":
        await prisma.sellerAd.delete({ where: { id: targetId } });
        deleted = true;
        break;
      case "DigitalAd":
        await prisma.digitalAd.delete({ where: { id: targetId } });
        deleted = true;
        break;
      default:
        return res
          .status(400)
          .json({ error: "نوع آگهی برای حذف پشتیبانی نمی‌شود" });
    }

    if (!deleted) {
      return res.status(404).json({ error: "آگهی مورد نظر یافت نشد" });
    }

    await prisma.report.update({
      where: { id: idStr },
      data: { status: "reviewed" },
    });

    res.json({ message: "آگهی با موفقیت حذف شد و گزارش بررسی شد" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "آگهی یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در حذف آگهی" });
  }
};

// ===== ۶. بلاک کردن چت بر اساس گزارش =====
export const blockChatByReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = toStr(id);
    if (!idStr) {
      return res.status(400).json({ error: "شناسه گزارش معتبر نیست" });
    }

    const report = await prisma.report.findUnique({
      where: { id: idStr },
    });

    if (!report) {
      return res.status(404).json({ error: "گزارش یافت نشد" });
    }

    if (report.reportType !== "chat") {
      return res.status(400).json({ error: "این گزارش مربوط به چت نیست" });
    }

    // دریافت چت و مکالمه همراه با اطلاعات کامل طرفین
    const chatWithConversation = await prisma.chat.findUnique({
      where: { id: report.targetId },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
          },
        },
        conversation: {
          include: {
            chats: {
              orderBy: { createdAt: "asc" },
              include: {
                fromUser: {
                  select: { id: true, name: true, phone: true },
                },
                toUser: {
                  select: { id: true, name: true, phone: true },
                },
              },
            },
          },
        },
      },
    });

    if (!chatWithConversation) {
      return res.status(404).json({ error: "چت یا مکالمه یافت نشد" });
    }

    // بلاک کردن مکالمه
    await prisma.conversation.update({
      where: { id: chatWithConversation.conversationId },
      data: { isBlocked: true },
    });

    // بروزرسانی وضعیت گزارش
    await prisma.report.update({
      where: { id: idStr },
      data: { status: "reviewed" },
    });

    res.json({
      message: "مکالمه با موفقیت بلاک شد و گزارش بررسی شد",
      conversation: {
        id: chatWithConversation.conversationId,
        isBlocked: true,
        participants: [
          chatWithConversation.fromUser,
          chatWithConversation.toUser,
        ],
        messages: chatWithConversation.conversation.chats,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "چت یا مکالمه یافت نشد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در بلاک کردن چت" });
  }
};
