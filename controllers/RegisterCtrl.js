const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      lastName,
      nationalCode,
      phone,
      password,
      birthDate,
      gender,
      province,
      city,
      referralCode,
    } = req.body;

    // 🔹 اعتبارسنجی اولیه
    if (
      !name ||
      !lastName ||
      !nationalCode ||
      !phone ||
      !password ||
      !birthDate ||
      !gender ||
      !province ||
      !city
    ) {
      return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
    }

    // 🔹 بررسی تکراری بودن کد ملی یا شماره تلفن
    const existingUser = await User.findOne({
      $or: [{ nationalCode }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "کاربر با این کد ملی یا شماره تلفن قبلا ثبت شده است.",
      });
    }

    // 🔹 هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 ایجاد کاربر جدید
    const newUser = new User({
      name,
      lastName,
      nationalCode,
      phone,
      password: hashedPassword,
      birthDate,
      gender,
      province,
      city,
      referralCode: referralCode || "",
    });

    await newUser.save();

    // 🔹 ایجاد توکن JWT
    const payload = {
      id: newUser._id,
      name: newUser.name || "",
      lastName: newUser.lastName || "",
      phone: newUser.phone || "",
      role: newUser.role,
      email: newUser.email || "",
      avatar: newUser.avatar || "",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true, // برای HTTPS واقعی
      sameSite: "none", // اجازه ارسال cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 🔹 بازگردانی اطلاعات کاربر + توکن (دقیقاً مثل لاگین)
    res.status(201).json({
      message: "ثبت نام با موفقیت انجام شد.",
      user: payload,
      token: `Bearer ${token}`, // ⬅️ فقط این خط اضافه شده
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطای سرور." });
  }
};
