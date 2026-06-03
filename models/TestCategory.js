const mongoose = require('mongoose');

const testCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Psychology"
  description: { type: String },
  icon: { type: String }, // URL or name of an icon for the UI
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, index: true},
  },
  {
    timestamps: true // updatedAt
  } 
)

module.exports = mongoose.model('TestCategory', testCategorySchema);