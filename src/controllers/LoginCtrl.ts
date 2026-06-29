import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { UAParser } from "ua-parser-js";
import * as WalletService from "../services/WalletService";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // 🔍 پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({ message: "کاربری با این شماره یافت نشد." });
    }

    try {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });
      if (!existingWallet) {
        await WalletService.createWalletForUser(user.id);
      }
    } catch (walletError) {
      console.error("Failed to create wallet for user during login:", walletError);
    }

    // 🔐 بررسی رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است." });
    }

    // 📦 JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };

    // 🔑 ساخت توکن
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // 📱 User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // 🌍 IP واقعی‌تر
    const ip =
      ((req.headers["x-forwarded-for"] as string) || "").split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";

    // 📱 DEVICE TYPE
    let deviceType = "desktop";
    const deviceRaw = (result.device?.type || "").toLowerCase();
    if (deviceRaw.includes("mobile")) deviceType = "mobile";
    else if (deviceRaw.includes("tablet")) deviceType = "tablet";

    // 🌐 BROWSER (فارسی)
    let browserRaw = (result.browser.name || "").toLowerCase();
    let browser = "unknown";
    if (browserRaw.includes("chrome")) {
      browser = "کروم";
    } else if (browserRaw.includes("firefox")) {
      browser = "فایرفاکس";
    } else if (
      browserRaw.includes("safari") &&
      !browserRaw.includes("chrome")
    ) {
      browser = "سافاری";
    } else if (browserRaw.includes("edge")) {
      browser = "مایکروسافت اج";
    } else if (browserRaw.includes("opera")) {
      browser = "اپرا";
    }

    // 💻 OS
    const os = result.os?.name || "unknown";

    // 📦 ساخت Session با Prisma
    const session = await prisma.session.create({
      data: {
        user: user.id,
        deviceInfo: {
          userAgent,
          ip,
          deviceType,
          browser,
          os,
        },
        refreshToken: token,
        isActive: true,
        lastActiveAt: new Date(),
      },
    });

    // 🔗 اتصال session به user (با اضافه کردن به آرایه sessions)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        sessions: {
          connect: { id: session.id },
        },
      },
    });

    // 🍪 cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 🧠 LOG
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
    console.error("Login error:", error);
    return res.status(500).json({
      message: "خطا در ورود کاربر",
      error: error.message,
    });
  }
};

// =================== export default ===================
const LoginCtrl = {
  loginUser,
};

export default LoginCtrl;
