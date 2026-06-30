import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessions = await prisma.session.findMany({
      where: {
        user: userId,
        isActive: true,
      },
      orderBy: { lastActiveAt: "desc" },
      select: {
        id: true,
        deviceInfo: true,
        createdAt: true,
        lastActiveAt: true,
        isRead: true,
      },
    });

    const unreadCount = sessions.filter((s) => !s.isRead).length;

    return res.json({
      unreadCount,
      sessions: sessions.map((s) => ({
        id: s.id,
        deviceType: (s.deviceInfo as any)?.deviceType,
        browser: (s.deviceInfo as any)?.browser,
        os: (s.deviceInfo as any)?.os,
        ip: (s.deviceInfo as any)?.ip,
        createdAt: s.createdAt,
        lastActiveAt: s.lastActiveAt,
        isRead: s.isRead,
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // تبدیل به string برای رفع خطای TypeScript
    const sessionId = req.params.id as string;

    const session = await prisma.session.updateMany({
      where: {
        id: sessionId,
        user: userId,
      },
      data: { isActive: false },
    });

    if (session.count === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json({ message: "session removed" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const logoutAllSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.session.updateMany({
      where: { user: userId },
      data: { isActive: false },
    });

    return res.json({ message: "all sessions closed" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const markSessionAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessionId = req.params.id as string;

    const session = await prisma.session.updateMany({
      where: {
        id: sessionId,
        user: userId,
        isActive: true,
      },
      data: { isRead: true },
    });

    if (session.count === 0) {
      return res
        .status(404)
        .json({ error: "session not found or already inactive" });
    }

    const updatedSession = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { isRead: true },
    });

    return res.json({
      message: "session marked as read",
      isRead: updatedSession?.isRead,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// =================== export default ===================
const SessionCtrl = {
  getUserSessions,
  deleteSession,
  logoutAllSessions,
  markSessionAsRead,
};

export default SessionCtrl;
