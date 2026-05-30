const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // پیدا کردن کاربر
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "کاربری با این شماره یافت نشد." });
    }

    // بررسی رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است." });
    }

    // payload توکن
    const payload = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };

    // ساخت JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d", // انقضا 7 روز
    });

    // 🔹 ذخیره توکن داخل کوکی
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true, // فقط HTTPS
      sameSite: "none", // برای cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
      path: "/",
    });

    // 🔹 ارسال Bearer Token به فرانت‌اند
    res.status(200).json({
      message: "ورود موفق ✅",
      user: payload,
      token: `Bearer ${token}`, // آماده برای Authorization header
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "خطا در ورود کاربر",
      error: error.message,
    });
  }
};
