const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cities: { type: [String], default: [] },
});

module.exports = mongoose.model("Province", ProvinceSchema);
