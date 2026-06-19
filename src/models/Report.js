const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      enum: ["employerAd", "jobSeekerAd", "sellerAd", "DigitalAd", "chat"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", reportSchema);
