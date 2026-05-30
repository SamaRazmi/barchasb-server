const mongoose = require("mongoose");

const sellerAdSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  application: { type: String },
  status: { type: String },

  // Media
  images: [
    {
      url: { type: String, required: true }, // URL واقعی فایل
      isMain: { type: Boolean, default: false },
    },
  ],

  // Price & Conditions
  priceIRT: { type: Number, default: 0 },
  isFixedPrice: { type: Boolean, default: false },
  isNegotiable: { type: Boolean, default: false },
  hasWarranty: { type: Boolean, default: false },
  isShippable: { type: Boolean, default: false },

  extraFeatures: { type: Map, of: String },

  // ⭐ Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },

  // 👤 Person type
  person: {
    type: String,
    enum: ["self", "other"],
    default: "self",
    required: true,
  },

  // Verification & Contact
  isVerified: { type: Boolean, default: false },
  enableChat: { type: Boolean, default: false },
  enablePhone: { type: Boolean, default: false },

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

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "آگهی باید یک مالک داشته باشد."],
  },
});

// ✅ Pre-save hook for images
sellerAdSchema.pre("save", function (next) {
  try {
    // اگر هیچ تصویری نیست، یک آبجکت خالی اضافه شود
    if (!Array.isArray(this.images) || this.images.length === 0) {
      this.images = [{ url: "", isMain: true }];
    }

    // اطمینان از اینکه فقط یک تصویر Main باشد
    const mainImages = this.images.filter((img) => img.isMain);
    if (mainImages.length !== 1) {
      this.images.forEach((img, idx) => (img.isMain = idx === 0));
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("SellerAd", sellerAdSchema);
