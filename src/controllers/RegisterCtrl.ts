import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import * as WalletService from "../services/WalletService";

// ================================================================
// تبدیل میلادی به شمسی با ساعت و دقیقه
// ================================================================

function toPersianDateWithTime(date: Date): string {
  const d = new Date(date);

  // جبران offset ایران (UTC+3:30)
  const offsetIran = 3.5 * 60 * 60 * 1000;

  const iranTime = new Date(
    d.getTime() +
      d.getTimezoneOffset() * 60 * 1000 +
      offsetIran,
  );

  const y = iranTime.getUTCFullYear();
  const m = iranTime.getUTCMonth() + 1;
  const day = iranTime.getUTCDate();
  const hour = iranTime.getUTCHours();
  const minute = iranTime.getUTCMinutes();

  // ==============================================================
  // الگوریتم تبدیل میلادی به شمسی
  // ==============================================================

  let gregorianYear = y;
  let gregorianMonth = m;
  let gregorianDay = day;

  const gregorianDaysInMonth = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (
    (gregorianYear % 4 === 0 &&
      gregorianYear % 100 !== 0) ||
    gregorianYear % 400 === 0
  ) {
    gregorianDaysInMonth[1] = 29;
  }

  const persianDaysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    29,
  ];

  let gy = gregorianYear - 1600;
  let gm = gregorianMonth;
  let gd = gregorianDay;

  let gDayNo =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400);

  for (let i = 0; i < gm - 1; ++i) {
    gDayNo += gregorianDaysInMonth[i];
  }

  gDayNo += gd;

  let jy = 0;
  let jDayNo = gDayNo - 79;
  let jMonthNo = 0;

  for (jy = 979; jy <= 1200; ++jy) {
    let jyLength = persianDaysInMonth[11];

    if (
      jy % 33 === 0 ||
      (jy % 33 === 1 && jy % 4 !== 0) ||
      (jy % 33 === 2 && jy % 4 === 0)
    ) {
      jyLength = 30;
    }

    if (jDayNo <= jyLength) break;

    jDayNo -= jyLength;
  }

  for (let jm = 0; jm < 12; ++jm) {
    let jmLength = persianDaysInMonth[jm];

    if (
      (jy % 33 === 0 && jm === 11) ||
      (jy % 33 === 1 &&
        jm === 11 &&
        jy % 4 !== 0) ||
      (jy % 33 === 2 &&
        jm === 11 &&
        jy % 4 === 0)
    ) {
      jmLength = 30;
    }

    if (jDayNo <= jmLength) break;

    jDayNo -= jmLength;
    jMonthNo++;
  }

  const persianYear = jy;
  const persianMonth = jMonthNo + 1;
  const persianDay = jDayNo;

  const pad = (n: number) =>
    String(n).padStart(2, "0");

  return `${persianYear}/${pad(
    persianMonth,
  )}/${pad(persianDay)} ${pad(hour)}:${pad(minute)}`;
}

// ================================================================
// Register User
// ================================================================

export const registerUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      phone,
      password,

      // فیلدهای پروفایل فعلاً اختیاری هستند
      name,
      lastName,
      nationalCode,
      birthDate,
      gender,
      province,
      city,
      referralCode,
    } = req.body;

    // ============================================================
    // فقط phone و password در ثبت‌نام اولیه الزامی هستند
    // ============================================================

    if (!phone || !password) {
      return res.status(400).json({
        message:
          "شماره تلفن و رمز عبور الزامی هستند.",
      });
    }

    // ============================================================
    // اعتبارسنجی شماره تلفن
    // ============================================================

    if (!/^09\d{9}$/.test(phone)) {
      return res.status(400).json({
        message:
          "شماره تلفن معتبر نیست.",
      });
    }

    // ============================================================
    // بررسی تکراری بودن شماره تلفن
    // ============================================================

    const existingUserByPhone =
      await prisma.user.findFirst({
        where: {
          phone,
        },
      });

    if (existingUserByPhone) {
      return res.status(400).json({
        message:
          "کاربری با این شماره تلفن قبلاً ثبت شده است.",
      });
    }

    // ============================================================
    // بررسی کد ملی فقط اگر ارسال شده باشد
    // ============================================================

    if (
      nationalCode &&
      nationalCode.trim() !== ""
    ) {
      const existingUserByNationalCode =
        await prisma.user.findFirst({
          where: {
            nationalCode,
          },
        });

      if (existingUserByNationalCode) {
        return res.status(400).json({
          message:
            "کاربری با این کد ملی قبلاً ثبت شده است.",
        });
      }
    }

    // ============================================================
    // Hash Password
    // ============================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ============================================================
    // زمان ثبت‌نام
    // همان روش قبلی شما
    // تاریخ شمسی + ساعت + دقیقه
    // ============================================================

    const now = new Date();

    const persianJoinedAt =
      toPersianDateWithTime(now);

    // ============================================================
    // ایجاد کاربر
    // ============================================================

    const newUser = await prisma.user.create({
      data: {
        // اطلاعات اختیاری
        // ✅ تغییر: به جای null، مقدار خالی ("") ذخیره می‌شود
        name: name?.trim() ?? "",
        lastName: lastName?.trim() ?? "",
        nationalCode:
          nationalCode?.trim() || null,

        // اطلاعات اصلی ثبت‌نام
        phone,
        password: hashedPassword,

        // اطلاعات پروفایل که بعداً تکمیل می‌شوند
        birthDate:
          birthDate?.trim() || null,

        // gender در Prisma اختیاری است
        // بنابراین اگر ارسال نشده باشد NULL ذخیره می‌شود
        gender:
          gender === "male" ||
          gender === "female"
            ? gender
            : null,

        province:
          province?.trim() || null,

        city:
          city?.trim() || null,

        referralCode:
          referralCode?.trim() || "",

        // ========================================================
        // تاریخ ثبت‌نام
        // ========================================================

        joinedAt: persianJoinedAt,

        // ========================================================
        // مقادیر پیش‌فرض سیستم
        // ========================================================

        acceptTerms: true,

        role: "USER",

        phone_confirmed: false,
        email_confirmed: false,

        online: false,

        lastSeen: now,

        email_log_num: 0,
        phone_log_num: 0,
      },
    });

    // ============================================================
    // ایجاد کیف پول
    // ============================================================

    try {
      await WalletService.createWalletForUser(
        newUser.id,
      );
    } catch (walletError) {
      console.error(
        "Failed to create wallet for user:",
        walletError,
      );
    }

    // ============================================================
    // ایجاد JWT
    // ============================================================

    const payload = {
      id: newUser.id,
      name: newUser.name || "",
      lastName: newUser.lastName || "",
      phone: newUser.phone || "",
      role: newUser.role,
      email: newUser.email || "",
      avatar: "",
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    // ============================================================
    // Cookie
    // ============================================================

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // ============================================================
    // Response
    // ============================================================

    return res.status(201).json({
      message:
        "ثبت نام با موفقیت انجام شد.",
      user: payload,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error(
      "Register error:",
      error,
    );

    return res.status(500).json({
      message: "خطای سرور.",
    });
  }
};

// ================================================================
// Export
// ================================================================

const RegisterCtrl = {
  registerUser,
};

export default RegisterCtrl;