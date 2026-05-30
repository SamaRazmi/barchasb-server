const mongoose = require("mongoose");

const RecentViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ad: { type: mongoose.Schema.Types.ObjectId, required: true }, // populate روی adType انجام می‌شود
    adType: {
      type: String,
      enum: ["EmployerAd", "JobSeekerAd", "SellerAd"],
      required: true,
    },
    viewedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// هر کاربر هر آگهی فقط یک بار
RecentViewSchema.index({ user: 1, ad: 1 }, { unique: true });
// برای فیلتر زمانی + sort سریع
RecentViewSchema.index({ user: 1, viewedAt: -1 });

// برای فیلتر ترکیبی (tab + time)
RecentViewSchema.index({ user: 1, adType: 1, viewedAt: -1 });

module.exports = mongoose.model("RecentView", RecentViewSchema);
