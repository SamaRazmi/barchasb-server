const mongoose = require("mongoose");

const AdCategoryAttributesSchema = new mongoose.Schema(
  {
    adCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdCategory",
      required: true,
      unique: true,
    },

    categoryId: {
      type: Number,
      required: true,
    },

    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AdCategoryAttributes",
  AdCategoryAttributesSchema
);
