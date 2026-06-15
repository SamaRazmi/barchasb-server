const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ success: false, msg: "توکن و رمز جدید الزامی است" });
    }

    if (newPassword.length < 5) {
      return res
        .status(400)
        .json({ success: false, msg: "رمز عبور باید حداقل 5 کاراکتر باشد" });
    }

    // verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, msg: "توکن نامعتبر یا منقضی شده است" });
    }

    const { phone } = decoded;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, msg: "توکن فاقد شماره تلفن است" });

    // هش کردن رمز جدید
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { phone },
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "کاربری با این شماره یافت نشد" });
    }

    res
      .status(200)
      .json({ success: true, msg: "رمز عبور با موفقیت تغییر کرد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "خطا در سرور" });
  }
};

module.exports = { resetPassword };
