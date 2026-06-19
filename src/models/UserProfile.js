const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // هر کاربر فقط یک پروفایل
  },

  profileImage: {
    type: String, // مسیر عکس یا Base64
    default: "", // اگر عکسی آپلود نشده باشد
  },

  address: {
    type: String,
    default: "",
  },

  educationLevel: {
    type: String,
    enum: ["دیپلم", "کاردانی", "کارشناسی", "کارشناسی ارشد", "دکتری"],
  },

  aboutMe: {
    type: String,
    maxLength: 1000,
  },

  interests: [
    {
      type: String,
    },
  ],

  skills: [
    {
      type: String,
    },
  ],

  resumeFile: {
    type: String, // مسیر فایل
  },

  portfolioFiles: [
    {
      type: String,
    },
  ],

  documents: [
    {
      title: String,
      file: String,
    },
  ],

  completed: {
    type: Boolean,
    default: false, // آیا پروفایل کامل شده؟
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
