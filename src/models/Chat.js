const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adId: { type: mongoose.Schema.Types.ObjectId, required: true },
  adType: {
    type: String,
    required: true,
    enum: ["EmployerAd", "JobSeekerAd", "SellerAd", "DigitalAd"],
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

ChatSchema.index({ conversationId: 1 });

ChatSchema.statics.getUnreadMessages = function (userId) {
  return this.find({ to: userId, read: false }).sort({ createdAt: 1 });
};

module.exports = mongoose.model("Chat", ChatSchema);
