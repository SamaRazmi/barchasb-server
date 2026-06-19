const mongoose = require('mongoose');

const testTypeSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'TestCategory', 
    required: true },
  name: { type: String, required: true }, // for example "MBTI"
  tags: [{ type: String, index: true }],
  description: { type: String },
  scoringMethod: { 
    type: String, 
    enum: ['weighted_level', 'trait_accumulation', 'forced_choice_mbti', 'likert_sum'] 
  },
  dimensions: [String],
  
  // Blueprint for normalization: how many questions per subject/difficulty
  blueprint: {
  structure: mongoose.Schema.Types.Mixed,
  levelWeights:{ type: Map, of: Number },
  totalQuestions: { type: Number },
  timeLimit: { type: Number, default: null }
},
  createdAt: { type: Date, default: Date.now, index: true},
  },
  {
    timestamps: true // updatedAt
  } );

module.exports = mongoose.model('TestType', testTypeSchema);
