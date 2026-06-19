const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceInfo: {
      userAgent: { type: String, default: "" },
      ip: { type: String, default: "" },

      deviceType: {
        type: String,
        enum: ["mobile", "tablet", "desktop"],
        default: "desktop",
      },

      browser: { type: String, default: "unknown" },
      os: { type: String, default: "unknown" },
    },

    refreshToken: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    // ✅ فیلد جدید برای مشخص کردن خوانده شدن جلسه توسط کاربر
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", SessionSchema);
