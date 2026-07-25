import { Request, Response } from "express";
import prisma from "../config/prisma";
import { isUserVip } from "../services/VipService";
import * as WalletService from "../services/WalletService";

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
        vipExpiresAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    // استفاده از bigint
    let balance = 0n;
    try {
      const balanceData = await WalletService.getAvailableBalance(userId);
      balance = BigInt(balanceData.available); // تبدیل number به bigint
    } catch (error) {
      balance = 0n;
    }
    const isVip = await isUserVip(userId);

    // تبدیل balance به string برای JSON
    res.json({ ...user, isVip, balance: balance.toString() });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر" });
  }
};

const AuthCtrl = {
  getMe,
};

export default AuthCtrl;
