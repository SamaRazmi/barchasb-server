const express = require("express");
const router = express();

const TicketCtrl = require("../controllers/ticketController");

// ایجاد تیکت (فقط کاربر ثبت‌نام شده می‌تواند)
router.post("/create-ticket", TicketCtrl.createTicket);

// گرفتن تمام تیکت‌ها
router.get("/tickets", TicketCtrl.getAllTickets);

// گرفتن یک تیکت خاص بر اساس ID
router.get("/ticket/:id", TicketCtrl.getTicketById);

// تغییر وضعیت تیکت
router.put("/ticket/:id/status", TicketCtrl.updateTicketStatus);

module.exports = router;
