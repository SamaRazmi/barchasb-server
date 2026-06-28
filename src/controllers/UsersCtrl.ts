import { Request, Response } from "express";
import prisma from "../config/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";
import * as WalletService from "../services/WalletService";

// =================== دریافت همه کاربران ===================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json({ msg: "ok", data: allUsers });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};

// =================== دریافت یک کاربر ===================
export const getOneUser = async (req: Request, res: Response) => {
  try {
    const id =
      typeof req.params.id === "string"
        ? req.params.id
        : req.params.id?.[0] || "";
    if (!id) {
      return res.status(400).json({ msg: "شناسه کاربر معتبر نیست" });
    }
    const theUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!theUser) {
      return res.status(404).json({ msg: "کاربر پیدا نشد" });
    }
    res.status(200).json({ msg: "ok", data: theUser });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};

// =================== ایجاد کاربر جدید ===================
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        joinedAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });

    try {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: newUser.id },
      });
      if (!existingWallet) {
        await WalletService.createWalletForUser(newUser.id);
      }
    } catch (walletError) {
      console.error("Failed to create wallet for user during login:", walletError);
    }
    res.status(201).json({ msg: "کاربر ایجاد شد", data: newUser });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا در ایجاد کاربر" });
  }
};

// =================== ارسال ایمیل ثبت‌نام ===================
export const sendRegisterEmail = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ msg: "ایمیل ارسال شد" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};

// =================== ارسال کد ثبت‌نام به تلفن ===================
export const sendRegisterPhone = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ msg: "کد ثبت‌نام ارسال شد" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};

// =================== تایید شماره تلفن ===================
export const verifyUserPhone = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { phone_confirmed: true },
    });

    if (!user) return res.status(404).json({ msg: "کاربر پیدا نشد" });

    res.status(200).json({ msg: "شماره تلفن تایید شد", data: user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};

// =================== ارسال لینک تایید ایمیل ===================
export const sendVerifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userIdParam = req.params.id;
    const userId =
      typeof userIdParam === "string" ? userIdParam : userIdParam?.[0] || "";

    if (!email) return res.status(400).json({ msg: "ایمیل ارسال نشده" });
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ msg: "کاربر پیدا نشد" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    await prisma.user.update({
      where: { id: userId },
      data: {
        tempEmail: email,
        emailVerificationCode: hashedCode,
        emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
        email_confirmed: false,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.LIARA_EMAIL_HOST,
      port: Number(process.env.LIARA_EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.LIARA_EMAIL_USER,
        pass: process.env.LIARA_EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: '"Barchasb" <info@barchasb.org>',
      to: email,
      subject: "🔐 کد تأیید ایمیل | Barchasb",
      text: `کد تایید شما: ${code}\nاین کد تا ۱۰ دقیقه معتبر است.`,
    });

    res.status(200).json({ msg: "کد تایید ارسال شد" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};

// =================== تایید ایمیل ===================
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ msg: "اطلاعات ناقص است" });

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        tempEmail: email,
        emailVerificationCode: hashedCode,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) return res.status(400).json({ msg: "کد نامعتبر یا منقضی شده" });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email,
        email_confirmed: true,
        tempEmail: null,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    });

    res.status(200).json({ msg: "ایمیل با موفقیت تایید شد" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};

// =================== تایید ایمیل با کد ===================
export const verifyEmailByCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  const userIdParam = req.params.id;
  const userId =
    typeof userIdParam === "string" ? userIdParam : userIdParam?.[0] || "";

  if (!code) return res.status(400).json({ msg: "کد ارسال نشده است" });
  if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  if (!user) return res.status(400).json({ msg: "کد اشتباه یا منقضی شده است" });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.tempEmail,
      email_confirmed: true,
      tempEmail: null,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    },
  });

  res.json({ msg: "ایمیل با موفقیت تایید شد" });
};

// =================== export default ===================
const UsersCtrl = {
  getAllUsers,
  getOneUser,
  createUser,
  sendRegisterEmail,
  sendRegisterPhone,
  verifyUserPhone,
  sendVerifyEmail,
  verifyEmail,
  verifyEmailByCode,
};

export default UsersCtrl;
