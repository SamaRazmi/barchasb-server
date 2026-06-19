import Ticket from "../models/Ticket";

// Middleware برای save (ایجاد و آپدیت)
Ticket.schema.pre("save", function (next) {
  // بروزرسانی updatedAt
  this.updatedAt = new Date().toLocaleDateString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // اضافه کردن رکورد جدید به statusHistory اگر status تغییر کرده باشد
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      changedAt: this.updatedAt,
    });
  }

  next();
});

// Middleware برای findOneAndUpdate (آپدیت مستقیم)
Ticket.schema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  // آپدیت updatedAt
  update.updatedAt = new Date().toLocaleDateString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // اضافه کردن تاریخچه وضعیت اگر status تغییر کرده باشد
  if (update.status) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc.status !== update.status) {
      update.$push = {
        ...(update.$push || {}),
        statusHistory: {
          status: update.status,
          changedAt: update.updatedAt,
        },
      };
    }
  }

  next();
});
