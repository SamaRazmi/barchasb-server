const mongoose = require("mongoose");

const digitalAdSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Media
  images: [
    {
      url: { type: String },
      isMain: { type: Boolean, default: false },
    },
  ],

  // Basic Info
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },

  // توضیح کلی digital
  digitalTotalDesc: { type: String },

  // پروژه‌ها
  projectNames: [{ type: String }],
  projectDescriptions: [{ type: String }],

  // Budget
  minBudget: { type: String },
  maxBudget: { type: String },

  // Required Skills
  requiredSkills: [
    {
      name: { type: String },
    },
  ],

  // Person type
  person: {
    type: String,
    enum: ["self", "other"],
    required: true,
    default: "self",
  },

  // Additional flags
  remote: { type: Boolean, default: false },
  thursdayHalf: { type: Boolean, default: false },

  // Verification
  verifyCode: { type: String },

  // Ad Management
  paymentMethod: {
    type: String,
    enum: ["Subscription", "Wallet", "Bank card"],
    default: "Bank card",
  },
  adStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Pre-save hook for images
digitalAdSchema.pre("save", function (next) {
  try {
    if (Array.isArray(this.images) && this.images.length > 0) {
      const main = this.images.filter((img) => img.isMain);
      if (main.length !== 1) {
        this.images.forEach((img, i) => (img.isMain = i === 0));
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("DigitalAd", digitalAdSchema);
