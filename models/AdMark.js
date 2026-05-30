const mongoose = require("mongoose");

const adMarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adId: { type: mongoose.Schema.Types.ObjectId, required: true }, // آیدی آگهی
  adType: {
    type: String,
    enum: ["EmployerAd", "JobSeekerAd", "SellerAd"], // نوع آگهی
    required: true,
  },
  type: {
    type: String,
    enum: ["favorite", "suspicious", "seen"],
    default: "favorite",
  },
  createdAt: { type: Date, default: Date.now },
});

// جلوگیری از اینکه کاربر یک آگهی را دوبار مارک کند
adMarkSchema.index({ userId: 1, adId: 1, adType: 1 }, { unique: true });

module.exports = mongoose.model("AdMark", adMarkSchema);
