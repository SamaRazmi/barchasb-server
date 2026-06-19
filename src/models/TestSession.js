const mongoose = require("mongoose");

const testSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  typeId: { type: mongoose.Schema.Types.ObjectId, ref: "TestType" }, // Fixed ref
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      userAnswer: { type: String },
      isCorrect: { type: Boolean },
      pointsEarned: { type: Number },
      dimension: { type: String },
      subject: { type: String },
      level: { type: String },
    },
  ],
  score: { type: Number },
  assignedLevel: { type: String },
  levelResults: { type: Map, of: mongoose.Schema.Types.Mixed }, // Added this
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },

  quickResult: { type: mongoose.Schema.Types.Mixed, default: null },
  detailedResult: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model("TestSession", testSessionSchema);
