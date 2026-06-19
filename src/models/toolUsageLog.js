const mongoose = require('mongoose');

const toolUsageLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  
  toolName: { 
    type: String, 
    required: true, 
    enum: [
      'convert-image', 
      'merge-pdf', 
      'compress-pdf', 
      'extract-pages', 
      'images-to-pdf',
    ],
    index: true 
  },
  
  status: { type: String, enum: ['success', 'failed'], required: true, index: true },
  errorMessage: { type: String, default: null },
  
  metadata: {
    inputSize: { type: Number, default: null },         // (bytes)
    outputSize: { type: Number, default: null },        //(bytes)
    inputFormat: { type: String, default: null },
    outputFormat: { type: String, default: null },
  },
  
  // (Ms)
  durationMs: { type: Number, default: null },
  
  // request info
  ip: { type: String, default: null },
  userAgent: { type: String, default: null }
  
}, { timestamps: true });

// index for reporting
toolUsageLogSchema.index({ createdAt: -1 });
toolUsageLogSchema.index({ toolName: 1, status: 1, createdAt: -1 });
toolUsageLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ToolUsageLog', toolUsageLogSchema);