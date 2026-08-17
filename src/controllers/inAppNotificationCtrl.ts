import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * GET /user/notifications/in-app
 * دریافت لیست نوتیفیکیشن‌های کاربر جاری
 */
export async function getInAppNotifications(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "لطفاً وارد حساب کاربری خود شوید",
      });
    }

    const notifications = await prisma.inAppNotification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        isRead: true,
      },
    });

    return res.json({
      items: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error("❌ Error in getInAppNotifications:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "خطا در دریافت پیام‌ها",
    });
  }
}

/**
 * PATCH /user/notifications/in-app/:id/read
 * علامت‌گذاری یک نوتیفیکیشن به عنوان خوانده‌شده
 */
export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    let { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "لطفاً وارد حساب کاربری خود شوید",
      });
    }

    // تبدیل id به string (اگر آرایه بود)
    if (Array.isArray(id)) {
      id = id[0];
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid ID",
        message: "شناسه نوتیفیکیشن معتبر نیست",
      });
    }

    const updated = await prisma.inAppNotification.updateMany({
      where: {
        id,
        userId,
      },
      data: { isRead: true },
    });

    if (updated.count === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "نوتیفیکیشن مورد نظر یافت نشد یا قبلاً خوانده شده است",
      });
    }

    return res.json({
      success: true,
      message: "نوتیفیکیشن با موفقیت خوانده شد",
    });
  } catch (error) {
    console.error("❌ Error in markNotificationAsRead:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "خطا در به‌روزرسانی نوتیفیکیشن",
    });
  }
}
