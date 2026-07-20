import { Request, Response } from "express";
import prisma from "../config/prisma"; // اضافه شد

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const sessionId = (req as any).user?.sessionId; // استخراج sessionId از توکن

    // =============== تغییر مهم ===============
    // غیرفعال کردن جلسه‌ی فعلی
    if (sessionId && userId) {
      await prisma.session.updateMany({
        where: {
          id: sessionId,
          user: userId,
          isActive: true,
        },
        data: { isActive: false },
      });
    } else {
      // در صورت عدم وجود sessionId (به عنوان fallback) تمام جلسات کاربر را غیرفعال کن
      if (userId) {
        await prisma.session.updateMany({
          where: { user: userId, isActive: true },
          data: { isActive: false },
        });
      }
    }
    // =========================================

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      path: "/",
    };

    // پاک کردن کوکی
    res.clearCookie("accessToken", cookieOptions);

    // یک کوکی خالی هم بفرست برای اطمینان
    res.cookie("accessToken", "", {
      ...cookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });

    return res.status(200).json({ message: "خروج با موفقیت انجام شد" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "خطا در خروج", error: error.message });
  }
};

// =================== export default ===================
const LogoutCtrl = {
  logoutUser,
};

export default LogoutCtrl;
