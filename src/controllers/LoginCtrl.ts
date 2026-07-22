import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { UAParser } from "ua-parser-js";
import * as WalletService from "../services/WalletService";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // 1️⃣ پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({ message: "کاربری با این شماره یافت نشد." });
    }

    // 2️⃣ بررسی رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است." });
    }

    // 3️⃣ ایجاد کیف پول در صورت نبود (خطا را نادیده می‌گیریم)
    try {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });
      if (!existingWallet) {
        await WalletService.createWalletForUser(user.id);
      }
    } catch (walletError) {
      console.error("❌ Wallet error (ignored):", walletError);
    }

    // =============== تغییر مهم ===============
    // غیرفعال کردن تمام جلسات فعال قبلی کاربر (Single Session)
    await prisma.session.updateMany({
      where: {
        user: user.id,
        isActive: true,
      },
      data: { isActive: false },
    });
    // =========================================

    // 4️⃣ اطلاعات دستگاه
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const ip =
      ((req.headers["x-forwarded-for"] as string) || "").split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";

    let deviceType = "desktop";
    const deviceRaw = (result.device?.type || "").toLowerCase();
    if (deviceRaw.includes("mobile")) deviceType = "mobile";
    else if (deviceRaw.includes("tablet")) deviceType = "tablet";

    let browserRaw = (result.browser.name || "").toLowerCase();
    let browser = "";
    if (browserRaw.includes("chrome")) browser = "کروم";
    else if (browserRaw.includes("firefox")) browser = "فایرفاکس";
    else if (browserRaw.includes("safari") && !browserRaw.includes("chrome"))
      browser = "سافاری";
    else if (browserRaw.includes("edge")) browser = "مایکروسافت اج";
    else if (browserRaw.includes("opera")) browser = "اپرا";

    const os = result.os?.name || "";

    // 5️⃣ ساخت deviceInfo
    const deviceInfo: any = {};
    if (userAgent) deviceInfo.userAgent = userAgent;
    if (ip) deviceInfo.ip = ip;
    if (deviceType) deviceInfo.deviceType = deviceType;
    if (browser) deviceInfo.browser = browser;
    if (os) deviceInfo.os = os;
    if (Object.keys(deviceInfo).length === 0) {
      deviceInfo._empty = true;
    }

    // 6️⃣ ساخت Session جدید
    const session = await prisma.session.create({
      data: {
        user: user.id,
        deviceInfo: deviceInfo,
        isActive: true,
        lastActiveAt: new Date(),
      },
    });

    // 7️⃣ اتصال session به user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        sessions: {
          connect: { id: session.id },
        },
      },
    });

    // 8️⃣ ساخت JWT با اضافه کردن sessionId به payload
    const payload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      sessionId: session.id, // <-- اضافه شد
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // 9️⃣ تنظیم کوکی
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("================================");
    console.log("🔥 LOGIN SUCCESS");
    console.log("👤 User:", user.id);
    console.log("📱 Device:", deviceType);
    console.log("🌐 Browser:", browser);
    console.log("💻 OS:", os);
    console.log("🌍 IP:", ip);
    console.log("🆔 Session ID:", session.id);
    console.log("⏰ Time:", new Date().toISOString());
    console.log("================================");

    return res.status(200).json({
      message: "ورود موفق ✅",
      user: payload,
      token: `Bearer ${token}`,
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      message: "خطا در ورود کاربر",
      error: error.message,
    });
  }
};

const LoginCtrl = {
  loginUser,
};

export default LoginCtrl;
