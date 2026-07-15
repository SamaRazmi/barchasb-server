import prisma from "../config/prisma";
import { TicketStatus } from "@prisma/client";

/**
 * تاریخچه وضعیت تیکت را به‌روز می‌کند.
 * این تابع جایگزین middlewareهای Mongoose است.
 */
export async function updateTicketWithHistory(
  ticketId: string,
  newStatus: TicketStatus,
) {
  // ۱. دریافت تیکت فعلی
  const currentTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!currentTicket) {
    throw new Error("Ticket not found");
  }

  // ۲. اگر وضعیت تغییری نکرده، فقط updatedAt را به‌روز می‌کنیم
  if (currentTicket.status === newStatus) {
    return prisma.ticket.update({
      where: { id: ticketId },
      data: {
        updatedAt: new Date().toISOString(),
      },
    });
  }

  // ۳. اگر وضعیت تغییر کرده، تاریخچه را به‌روز می‌کنیم
  const now = new Date().toISOString();
  const newHistoryEntry = {
    status: newStatus,
    changedAt: now,
  };

  // ۴. ترکیب تاریخچه قبلی با جدید
  const updatedHistory = [
    ...((currentTicket.statusHistory as any[]) || []),
    newHistoryEntry,
  ];

  // ۵. به‌روزرسانی نهایی
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: newStatus,
      statusHistory: updatedHistory,
      updatedAt: now,
    },
  });
}

/**
 * ایجاد تیکت جدید با تاریخچه اولیه
 */
export async function createTicketWithHistory(data: any) {
  const now = new Date().toISOString();

  return prisma.ticket.create({
    data: {
      ...data,
      statusHistory: [
        {
          status: data.status || "open",
          changedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  });
}
