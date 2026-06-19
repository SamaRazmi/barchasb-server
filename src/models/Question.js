const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestType', required: true },
  subject: { type: String, required: true }, 
  level: {type: String, required: true},
  questionText: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    value: { type: Number },
    isCorrect: { type: Boolean },
    traitPoints: { type: Object, default: {} }
  }],
  dimension: { type: String },
  isReverseScored: { type: Boolean, default: false }, 
  
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now, index: true},
  metadata: {type: mongoose.Schema.Types.Mixed},
  },
  {
    timestamps: true // updatedAt
  });

module.exports = mongoose.model('Question', questionSchema);