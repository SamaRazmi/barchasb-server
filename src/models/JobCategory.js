// models/JobCategory.js
const mongoose = require("mongoose");

const JobCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobCategory", JobCategorySchema);
