const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "نام وارد نشده است."],
    min: [2, "نام باید حداقل 2 کاراکتر باشد"],
    max: [50, "نام باید حداکثر 50 کاراکتر باشد"],
  },
  lastName: {
    type: String,
    required: [true, "نام خانوادگی وارد نشده است."],
    min: [2, "نام خانوادگی باید حداقل 2 کاراکتر باشد"],
    max: [50, "نام خانوادگی باید حداکثر 50 کاراکتر باشد"],
  },
  username: {
    type: String,
    required: false,
    unique: true,
    min: [3, "نام کاربری باید حداقل 3 کاراکتر باشد"],
    max: [30, "نام کاربری باید حداکثر 30 کاراکتر باشد"],
  },
  nationalCode: {
    type: String,
    required: [true, "کد ملی وارد نشده است."],
    unique: true,
    length: 10,
  },
  phone: {
    type: String,
    required: [true, "شماره تلفن وارد نشده است."],
    unique: true,
    match: /^09\d{9}$/,
  },
  password: {
    type: String,
    required: [true, "رمز عبور وارد نشده است."],
    min: [5, "رمز عبور باید حداقل 5 کاراکتر باشد"],
    max: [30, "رمز عبور باید حداکثر 30 کاراکتر باشد"],
  },
  birthDate: {
    type: String,
    required: [true, "تاریخ تولد وارد نشده است."],
  },
  gender: {
    type: String,
    required: [true, "جنسیت وارد نشده است."],
    enum: {
      values: ["male", "female"],
      message: "جنسیت باید 'زن' یا 'مرد' باشد",
    },
  },
  province: {
    type: String,
    required: [true, "استان وارد نشده است."],
  },
  city: {
    type: String,
    required: [true, "شهر/منطقه وارد نشده است."],
  },
  acceptTerms: {
    type: Boolean,
    required: [true, "پذیرش قوانین الزامی است."],
    default: false,
  },
  role: {
    type: Number,
    enum: [0, 1, 3, 5], // 0 = کاربر عادی، 1 = کارفرما، 3 = کارجو، 5 = آگهی
    default: 0, // پیش‌فرض برای کاربر عادی
  },

  joinedAt: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  email_confirmed: {
    type: Boolean,
    default: false,
  },
  tempEmail: {
    type: String,
    unique: true,
    sparse: true,
  },

  emailVerificationCode: {
    type: String,
  },

  emailVerificationExpires: {
    type: Date,
  },
  phone_confirmed: {
    type: Boolean,
    default: false,
  },
  email_log_num: {
    type: Number,
    default: 0,
  },
  phone_log_num: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    default: "",
  },

  // فیلدهای چت
  online: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
