const mongoose = require("mongoose");

const AdCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdCategory",
    default: null,
  },
});

module.exports = mongoose.model("AdCategory", AdCategorySchema);
