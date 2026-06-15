const jwt = require("jsonwebtoken");
const OtpService = require("../services/OtpService");
const User = require("../models/User"); // برای بررسی وجود کاربر

// ارسال OTP
exports.sendOTP = async (req, res) => {
  try {
    const { phone, purpose = "default" } = req.body;
    if (!phone) return res.status(400).json({ msg: "شماره موبایل الزامی است" });

    // برای فراموشی رمز، بررسی وجود کاربر
    if (purpose === "reset") {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ msg: "کاربری با این شماره یافت نشد" });
      }
    }

    const result = await OtpService.sendOTP(phone, purpose);
    res.status(200).json({ msg: result.msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// تایید OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, code, purpose = "default" } = req.body;
    if (!phone || !code)
      return res.status(400).json({ msg: "شماره و کد الزامی است" });

    const result = await OtpService.verifyOTP(phone, code, purpose);
    if (!result.success) return res.status(400).json({ msg: result.msg });

    const response = { msg: result.msg };

    // فقط برای فراموشی رمز (purpose == "reset") توکن صادر کن
    if (purpose === "reset") {
      const resetToken = jwt.sign(
        { phone, purpose: "reset" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );
      response.resetToken = resetToken;
    }

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
