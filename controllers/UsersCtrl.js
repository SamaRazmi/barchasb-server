const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// =================== دریافت همه کاربران ===================
const getAllUsers = async (req, res) => {
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
module.exports.getAllUsers = getAllUsers;

// =================== دریافت یک کاربر ===================
const getOneUser = async (req, res) => {
  try {
    const theUser = await prisma.user.findUnique({
      where: { id: req.params.id },
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
module.exports.getOneUser = getOneUser;

// =================== ایجاد کاربر جدید ===================
const createUser = async (req, res) => {
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
    res.status(201).json({ msg: "کاربر ایجاد شد", data: newUser });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا در ایجاد کاربر" });
  }
};
module.exports.createUser = createUser;

// =================== ارسال ایمیل ثبت‌نام (قدیمی - دست نخورده) ===================
const sendRegisterEmail = async (req, res) => {
  try {
    res.status(200).json({ msg: "ایمیل ارسال شد" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};
module.exports.sendRegisterEmail = sendRegisterEmail;

// =================== ارسال کد ثبت‌نام به تلفن (قدیمی) ===================
const sendRegisterPhone = async (req, res) => {
  try {
    res.status(200).json({ msg: "کد ثبت‌نام ارسال شد" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "خطا" });
  }
};
module.exports.sendRegisterPhone = sendRegisterPhone;

// =================== تایید شماره تلفن ===================
const verifyUserPhone = async (req, res) => {
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
module.exports.verifyUserPhone = verifyUserPhone;

// =======================================================
// =================== ارسال لینک تایید ایمیل ===================
const sendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.params.id;

    if (!email) return res.status(400).json({ msg: "ایمیل ارسال نشده" });
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ msg: "کاربر پیدا نشد" });

    // کد ۶ رقمی
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
module.exports.sendVerifyEmail = sendVerifyEmail;

// =================== تایید ایمیل ===================
const verifyEmail = async (req, res) => {
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

    // تایید نهایی
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
module.exports.verifyEmail = verifyEmail;

// =================== تایید ایمیل با کد ===================
const verifyEmailByCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.params.id;

  if (!code) return res.status(400).json({ msg: "کد ارسال نشده است" });

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  if (!user) return res.status(400).json({ msg: "کد اشتباه یا منقضی شده است" });

  // تایید ایمیل
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
module.exports.verifyEmailByCode = verifyEmailByCode;
