const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    // گرفتن اطلاعات کامل کاربر از دیتابیس
    const user = await User.findById(req.user.id).select("-password"); // رمز عبور حذف شود
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    res.json({ user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر" });
  }
};
