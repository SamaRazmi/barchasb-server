require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.LIARA_EMAIL_HOST,
  port: Number(process.env.LIARA_EMAIL_PORT),
  secure: false, // true اگر port = 465
  auth: {
    user: process.env.LIARA_EMAIL_USER,
    pass: process.env.LIARA_EMAIL_PASS,
  },
});

async function sendTestEmail() {
  try {
    await transporter.verify();
    console.log("✅ SMTP آماده ارسال ایمیل است");

    const info = await transporter.sendMail({
      from: "info@barchasb.org",
      to: "sama69razmi99@gmail.com", // ایمیلی که میخوای تست کنی
      subject: "تست ایمیل از Liara",
      text: "این یک ایمیل تستی است برای بررسی تنظیمات SMTP",
    });

    console.log("📧 ایمیل ارسال شد:", info.messageId);
  } catch (err) {
    console.error("❌ خطا در ارسال ایمیل:", err);
  }
}

sendTestEmail();
