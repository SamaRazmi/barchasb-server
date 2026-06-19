// src/controllers/ticketController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

// تابع کمکی برای تبدیل params به string
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// 1️⃣ ایجاد تیکت
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { email, title, description } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        error:
          "ایمیل نامعتبر است. فقط کاربران ثبت‌نام شده می‌توانند تیکت ارسال کنند.",
      });
    }

    if (!userExists.email_confirmed || !userExists.phone_confirmed) {
      return res.status(403).json({
        success: false,
        error: "ابتدا ایمیل و شماره تلفن خود را تایید کنید.",
      });
    }

    if (!userExists.phone) {
      return res.status(400).json({
        success: false,
        error: "شماره تلفن شما ثبت نشده است. لطفا شماره خود را وارد کنید.",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        user: userExists.id,
        email,
        phone: userExists.phone,
        title,
        description,
        createdAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });

    const ticketResponse = {
      _id: ticket.id,
      user: ticket.user,
      phone: ticket.phone,
      email: ticket.email,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    const userResponse = {
      _id: userExists.id,
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
  } catch (error: any) {
    console.error("Ticket creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2️⃣ گرفتن تمام تیکت‌ها
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3️⃣ گرفتن یک تیکت بر اساس ID
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const id = toStr(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "شناسه نامعتبر است" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      return res.status(404).json({ success: false, error: "تیکت پیدا نشد" });
    }
    res.status(200).json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4️⃣ تغییر وضعیت تیکت
export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const id = toStr(req.params.id);

    if (!id) {
      return res.status(400).json({ success: false, error: "شناسه نامعتبر است" });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });

    res.status(200).json({
      success: true,
      ticket,
      message: `وضعیت تیکت به ${status} تغییر کرد`,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "تیکت پیدا نشد" });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// =================== export default ===================
const ticketController = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
};

export default ticketController;