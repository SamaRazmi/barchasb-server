const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  adId: { type: mongoose.Schema.Types.ObjectId, required: true },
  adType: { type: String, required: true },
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", ConversationSchema);
