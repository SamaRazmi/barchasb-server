const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Media
  images: [
    {
      _id: false,
      url: { type: String },
      isMain: { type: Boolean, default: false },
    },
  ],

  // Personal Info
  name: { type: String, required: true },
  age: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  militaryStatus: { type: String },
  phoneNumber: { type: String, required: true },

  // Location & Category
  state: { type: String },
  city: { type: String },
  category: { type: String, required: true },

  // Files
  resumeFile: { type: String },
  workSampleFile: { type: String },

  // Professional Details
  education: { type: String },
  skills: [{ type: String }],
  suggestedSalaryIRT: { type: String },
  aboutMe: { type: String },

  // Social Links
  instagram: { type: String },
  linkedIn: { type: String },
  gitHub: { type: String },

  // Career History
  careerHistory: [
    {
      _id: false,
      title: String,
      description: String,
    },
  ],

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

  // Verification & Settings
  isVerified: { type: Boolean, default: false },
  enableChat: { type: Boolean, default: true },
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

  // ✅ توضیحات اضافه / modalDesc
  userDesc: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Image pre-save logic
jobSeekerSchema.pre("save", function (next) {
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

module.exports = mongoose.model("JobSeekerAd", jobSeekerSchema);
