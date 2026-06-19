import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "احراز هویت نشده" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        nationalCode: true,
        phone: true,
        email: true,
        birthDate: true,
        gender: true,
        province: true,
        city: true,
        acceptTerms: true,
        role: true,
        joinedAt: true,
        email_confirmed: true,
        phone_confirmed: true,
        // password حذف شده
      },
    });

    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    res.json({ user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر" });
  }
};

// =================== export default ===================
const AuthCtrl = {
  getMe,
};

export default AuthCtrl;
