const Otp = require("../models/Otp");
const SmsService = require("./SmsService");

class OtpService {
  constructor() {
    this.username = process.env.PAYAMAK_USERNAME;
    this.password = process.env.PAYAMAK_PASSWORD;
    this.bodyId = process.env.PAYAMAK_OTP_BODY_ID;

    if (!this.username || !this.password || !this.bodyId) {
      throw new Error(
        "Missing ENV: PAYAMAK_USERNAME, PAYAMAK_PASSWORD, PAYAMAK_OTP_BODY_ID",
      );
    }

    this.smsService = new SmsService(this.username, this.password);
  }

  // اضافه شدن پارامتر purpose (اختیاری، برای سازگاری با کدهای قدیمی)
  async sendOTP(phone, purpose = "default") {
    if (!phone) throw new Error("شماره موبایل الزامی است");

    const formattedPhone = phone.startsWith("0")
      ? "+98" + phone.slice(1)
      : phone;

    let code;
    let exists;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
      exists = await Otp.findOne({ code });
    } while (exists);

    // ذخیره با purpose
    await Otp.create({ phone: formattedPhone, code, purpose });
    console.log(
      `🔢 OTP تولید شده برای ${formattedPhone} (${purpose}): ${code}`,
    );

    try {
      const result = await this.smsService.sendByBaseNumber(
        code,
        formattedPhone,
        this.bodyId,
      );

      if (!result.success) {
        console.warn(`⚠️ ارسال پیامک ناموفق, errorCode: ${result.errorCode}`);
      } else {
        console.log(`✅ پیامک با موفقیت ارسال شد، recId: ${result.recId}`);
      }
    } catch (err) {
      console.error("⚠️ خطا در ارسال پیامک:", err.message);
    }

    return { msg: "کد ارسال شد", code };
  }

  // اضافه شدن پارامتر purpose (اختیاری)
  async verifyOTP(phone, code, purpose = "default") {
    if (!phone || !code) throw new Error("شماره و کد الزامی است");

    const formattedPhone = phone.startsWith("0")
      ? "+98" + phone.slice(1)
      : phone;

    // جستجو با در نظر گرفتن purpose
    const otp = await Otp.findOne({ phone: formattedPhone, code, purpose });
    if (!otp) return { success: false, msg: "کد اشتباه یا منقضی شده" };

    await Otp.deleteOne({ _id: otp._id });
    return { success: true, msg: "کد صحیح است، وارد شدید" };
  }
}

module.exports = new OtpService();
