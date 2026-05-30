const Otp = require("../models/Otp");
const SmsService = require("./SmsService");

class OtpService {
  constructor() {
    // استفاده از متغیرهای محیطی قدیمی با نام PAYAMAK
    this.username = process.env.PAYAMAK_USERNAME;
    this.password = process.env.PAYAMAK_PASSWORD;
    // مهم: bodyId را از محیط می‌خوانیم (در .env باید مقدار 411438 یا 455829 باشد)
    this.bodyId = process.env.PAYAMAK_OTP_BODY_ID;

    if (!this.username || !this.password || !this.bodyId) {
      throw new Error(
        "Missing ENV: PAYAMAK_USERNAME, PAYAMAK_PASSWORD, PAYAMAK_OTP_BODY_ID",
      );
    }

    this.smsService = new SmsService(this.username, this.password);
  }

  async sendOTP(phone) {
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

    await Otp.create({ phone: formattedPhone, code });
    console.log(`🔢 OTP تولید شده برای ${formattedPhone}: ${code}`);

    try {
      // ارسال فقط کد به عنوان متن الگو (مطابق روش کارآمد)
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

  async verifyOTP(phone, code) {
    if (!phone || !code) throw new Error("شماره و کد الزامی است");

    const formattedPhone = phone.startsWith("0")
      ? "+98" + phone.slice(1)
      : phone;

    const otp = await Otp.findOne({ phone: formattedPhone, code });
    if (!otp) return { success: false, msg: "کد اشتباه یا منقضی شده" };

    await Otp.deleteOne({ _id: otp._id });
    return { success: true, msg: "کد صحیح است، وارد شدید" };
  }
}

module.exports = new OtpService();
