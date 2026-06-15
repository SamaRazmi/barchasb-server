const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  purpose: {
    type: String,
    default: "default", // برای سازگاری با کدهای قبلی که purpose ارسال نمی‌کنند
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// TTL: OTP بعد از 10 دقیقه (600 ثانیه) حذف شود
// زمان قبلی ۶۰ ثانیه برای فراموشی رمز خیلی کم بود
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("Otp", otpSchema);
