const mongoose = require("mongoose");

const reportReasonSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "general",
        "employerAd",
        "jobSeekerAd",
        "sellerAd",
        "DigitalAd",
        "chat_employerAd",
        "chat_jobSeekerAd",
        "chat_sellerAd",
        "chat_DigitalAd",
      ],
      default: "general",
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

reportReasonSchema.index({ type: 1, key: 1 }, { unique: true });
reportReasonSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model("ReportReason", reportReasonSchema);
