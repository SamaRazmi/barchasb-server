const Ticket = require("../models/Ticket");
const User = require("../models/User"); // مدل کاربران

// 1️⃣ ایجاد تیکت
exports.createTicket = async (req, res) => {
  try {
    const { email, title, description } = req.body;

    // پیدا کردن کاربر
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        error:
          "ایمیل نامعتبر است. فقط کاربران ثبت‌نام شده می‌توانند تیکت ارسال کنند.",
      });
    }

    // بررسی تایید ایمیل و شماره تلفن
    if (!userExists.email_confirmed || !userExists.phone_confirmed) {
      return res.status(403).json({
        success: false,
        error: "ابتدا ایمیل و شماره تلفن خود را تایید کنید.",
      });
    }

    // مطمئن شدن از وجود شماره تلفن
    if (!userExists.phone) {
      return res.status(400).json({
        success: false,
        error: "شماره تلفن شما ثبت نشده است. لطفا شماره خود را وارد کنید.",
      });
    }

    // ایجاد تیکت
    const ticket = await Ticket.create({
      user: userExists._id, // فقط id
      email, // ایمیل
      phone: userExists.phone, // شماره تلفن
      title,
      description,
    });

    // پاسخ با تبدیل ObjectId به string و اطلاعات کاربر
    const ticketResponse = {
      _id: ticket._id.toString(),
      user: ticket.user.toString(),
      phone: ticket.phone, // همیشه مقدار دارد
      email: ticket.email,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    const userResponse = {
      _id: userExists._id.toString(),
      email: userExists.email,
      phone: userExists.phone,
      name: userExists.name,
    };

    console.log("Ticket created:", ticketResponse);
    console.log("User info:", userResponse);

    res.status(201).json({
      success: true,
      ticket: ticketResponse,
      user: userResponse,
    });
  } catch (error) {
    console.error("Ticket creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2️⃣ گرفتن تمام تیکت‌ها
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3️⃣ گرفتن یک تیکت بر اساس ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: "تیکت پیدا نشد" });
    }
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4️⃣ تغییر وضعیت تیکت
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body; // وضعیت جدید: open | in_progress | closed
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, error: "تیکت پیدا نشد" });
    }

    // تغییر وضعیت
    ticket.status = status;
    await ticket.save(); // middleware خودکار updatedAt و statusHistory را بروزرسانی می‌کند

    res.status(200).json({
      success: true,
      ticket,
      message: `وضعیت تیکت به ${status} تغییر کرد`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
