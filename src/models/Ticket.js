const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // هر تیکت باید به کاربر متصل باشد
  },
  email: {
    type: String,
    required: [true, "ایمیل وارد نشده است."],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "ایمیل وارد شده معتبر نیست.",
    ],
  },
  phone: {
    // ← شماره تلفن اضافه شد
    type: String,
    required: [true, "شماره تلفن وارد نشده است."],
    match: [/^09\d{9}$/, "شماره تلفن وارد شده معتبر نیست."],
  },
  title: {
    type: String,
    required: [true, "عنوان وارد نشده است."],
    min: [3, "عنوان باید حداقل 3 کاراکتر باشد"],
    max: [100, "عنوان باید حداکثر 100 کاراکتر باشد"],
  },
  description: {
    type: String,
    required: [true, "توضیحات وارد نشده است."],
    min: [10, "توضیحات باید حداقل 10 کاراکتر باشد"],
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "closed"],
    default: "open",
  },
  statusHistory: [
    {
      status: { type: String, enum: ["open", "in_progress", "closed"] },
      changedAt: { type: String },
    },
  ],
  createdAt: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    required: true,
  },
  updatedAt: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    required: true,
  },
});

module.exports = mongoose.model("Ticket", TicketSchema);
