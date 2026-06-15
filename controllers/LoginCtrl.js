const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
const UAParser = require("ua-parser-js");

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 🔍 پیدا کردن کاربر
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "کاربری با این شماره یافت نشد." });
    }

    // 🔐 بررسی رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است." });
    }

    // 📦 JWT payload
    const payload = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };

    // 🔑 ساخت توکن
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 📱 User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // 🌍 IP واقعی‌تر
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";

    // 📱 DEVICE TYPE (اصلاح مهم برای enum)
    let deviceType = "desktop";

    const deviceRaw = (result.device?.type || "").toLowerCase();

    if (deviceRaw.includes("mobile")) deviceType = "mobile";
    else if (deviceRaw.includes("tablet")) deviceType = "tablet";

    // 🌐 BROWSER (اصلاح کامل)
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

    // 📦 ساخت Session
    const session = await Session.create({
      user: user._id,
      deviceInfo: {
        userAgent,
        ip,
        deviceType, // ✅ desktop / mobile / tablet
        browser, // ✅ فارسی شده
        os,
      },
      refreshToken: token,
      isActive: true,
      lastActiveAt: new Date(),
    });

    // 🔗 اتصال session به user
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { sessions: session._id },
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
    console.log("👤 User:", user._id.toString());
    console.log("📱 Device:", deviceType);
    console.log("🌐 Browser:", browser);
    console.log("💻 OS:", os);
    console.log("🌍 IP:", ip);
    console.log("🆔 Session ID:", session._id.toString());
    console.log("⏰ Time:", new Date().toISOString());
    console.log("================================");

    return res.status(200).json({
      message: "ورود موفق ✅",
      user: payload,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "خطا در ورود کاربر",
      error: error.message,
    });
  }
};
