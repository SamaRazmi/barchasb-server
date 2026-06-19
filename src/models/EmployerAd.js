const mongoose = require("mongoose");

const employerAdSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  images: [
    {
      url: { type: String, required: true },
      isMain: { type: Boolean, default: false },
    },
  ],

  name: { type: String, required: true },
  title: { type: String, required: true },

  // ✅ ساختار جدید: چند دسته اصلی با زیردسته‌های جداگانه
  categories: [
    {
      name: { type: String, required: true },
      subCategories: { type: [String], default: [] },
    },
  ],

  // بقیه فیلدها بدون تغییر
  state: { type: String },
  city: { type: String },
  cooperationType: { type: String },
  gender: { type: String },
  militaryStatus: { type: String, default: "None" },
  experience: { type: String },
  paymentMethod: { type: String },
  isRemote: { type: Boolean, default: false },
  thursdayUntilNoon: { type: Boolean, default: false },
  startTime: { type: String },
  endTime: { type: String },
  minSalary: { type: String },
  maxSalary: { type: String },
  companyName: { type: String },
  companyType: { type: String },
  benefits: { type: String },
  insurance: { type: String },
  education: { type: String },
  companyDescription: { type: String },
  jobDetails: [
    {
      _id: false,
      title: String,
      description: String,
    },
  ],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  person: {
    type: String,
    enum: ["self", "other"],
    default: "self",
    required: true,
  },
  isVerified: { type: Boolean, default: false },
  enableChat: { type: Boolean, default: false },
  enablePhone: { type: Boolean, default: false },
  adPaymentMethod: {
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

employerAdSchema.pre("save", function (next) {
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

module.exports = mongoose.model("EmployerAd", employerAdSchema);
