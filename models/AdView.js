const mongoose = require("mongoose");

const adViewSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, required: true },
  adType: {
    type: String,
    enum: ["EmployerAd", "JobSeekerAd", "SellerAd", "DigitalAd"],
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  viewedAt: { type: Date, default: Date.now, index: true },
});

adViewSchema.index({ ownerId: 1, viewedAt: -1 });

module.exports = mongoose.model("AdView", adViewSchema);
