// src/controllers/ChatCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

// ====== Redis Mock ======
const redis = {
  hget: async (key: string, field: string) => null,
  hset: async (key: string, field: string, value: any) => 1,
  hdel: async (key: string, field: string) => 1,
  publish: async (channel: string, message: string) => {
    console.log(`📨 [Redis Mock] Publish to ${channel}`);
    return 1;
  },
  hgetall: async (key: string) => ({}),
  setex: async (key: string, seconds: number, value: string) => "OK",
  expire: async (key: string, seconds: number) => 1,
  del: async (key: string) => 1,
};
// ===================================

// ------------------------------------------------------------
// ۱. ارسال پیام و آپدیت Conversation
// ------------------------------------------------------------
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { from, to, adId, adType, content, type } = req.body;

    if (!from || !to || !adId || !adType || !content) {
      return res.status(400).json({
        success: false,
        message: "همه فیلدها الزامی هستند",
      });
    }

    let conv = await prisma.conversation.findFirst({
      where: {
        adId,
        adType,
        participants: {
          hasEvery: [from, to],
        },
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          participants: [from, to],
          adId,
          adType,
          lastMessage: content,
        },
      });
    } else {
      conv = await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          lastMessage: content,
          updatedAt: new Date(),
        },
      });
    }

    const message = await prisma.chat.create({
      data: {
        from,
        to,
        adId,
        adType,
        conversationId: conv.id,
        content,
        type: type || "text",
        read: false,
      },
    });

    try {
      const isOnline = await redis.hget("onlineUsers", to);
      if (isOnline) {
        await redis.publish(`chat:${to}`, JSON.stringify(message));
      }
    } catch (redisError) {
      console.log("⚠️ Redis error (ignored):", redisError);
    }

    res.status(201).json({
      success: true,
      message,
      conversation: conv,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ------------------------------------------------------------
// ۲. گرفتن پیام‌های یک آگهی بین دو کاربر
// ------------------------------------------------------------
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { adType, adId, userId1, userId2 } = req.params;

    // تبدیل پارامترها به string (رفع خطای TS2322)
    const adIdStr = typeof adId === "string" ? adId : adId?.[0] || "";
    const fromUser1 =
      typeof userId1 === "string" ? userId1 : userId1?.[0] || "";
    const fromUser2 =
      typeof userId2 === "string" ? userId2 : userId2?.[0] || "";

    const messages = await prisma.chat.findMany({
      where: {
        adType: adType as any, // cast به AdType
        adId: adIdStr,
        OR: [
          { from: fromUser1, to: fromUser2 },
          { from: fromUser2, to: fromUser1 },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        fromUser: { select: { name: true, id: true } },
        toUser: { select: { name: true, id: true } },
      },
    });

    // استفاده از any برای راحت‌تر شدن نوع‌دهی
    const formatted = messages.map((msg: any) => ({
      ...msg,
      from: msg.fromUser,
      to: msg.toUser,
    }));

    res.status(200).json({
      success: true,
      messages: formatted,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ------------------------------------------------------------
// ۳. وضعیت آنلاین / آخرین بازدید
// ------------------------------------------------------------
export const getUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    let online = false;
    let lastSeen = null;

    try {
      const onlineResult = await redis.hget("onlineUsers", userIdStr);
      const lastSeenResult = await redis.hget("lastSeenUsers", userIdStr);

      online = !!onlineResult;
      lastSeen = lastSeenResult ? new Date(+lastSeenResult) : null;
    } catch (redisError) {
      console.log("⚠️ Redis error (ignored):", redisError);
    }

    res.status(200).json({
      success: true,
      online,
      lastSeen,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ------------------------------------------------------------
// ۴. گرفتن لیست مکالمات یک کاربر
// ------------------------------------------------------------
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { has: userIdStr },
      },
      orderBy: { updatedAt: "desc" },
    });

    // جمع‌آوری تمام userIdهای شرکت‌کننده
    const allParticipantIds = new Set<string>();
    conversations.forEach((conv) => {
      conv.participants.forEach((p) => allParticipantIds.add(p));
    });

    // دریافت اطلاعات کاربران
    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(allParticipantIds) } },
      select: { id: true, name: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = conversations.map((conv) => ({
      ...conv,
      participants: conv.participants.map(
        (pId) => userMap.get(pId) || { id: pId, name: "ناشناس" },
      ),
    }));

    res.status(200).json({ success: true, conversations: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ------------------------------------------------------------
// ۵. تایپینگ (typing)
// ------------------------------------------------------------
export const typingStatus = async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, isTyping } = req.body;

    try {
      const online = await redis.hget("onlineUsers", toUserId);
      if (online) {
        await redis.publish(
          `typing:${toUserId}`,
          JSON.stringify({ fromUserId, isTyping }),
        );
      }
    } catch (redisError) {
      console.log("⚠️ Redis error (ignored):", redisError);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ------------------------------------------------------------
// ۶. تعداد پیام‌های خوانده نشده به تفکیک adType
// ------------------------------------------------------------
export const getUnreadCounts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    if (!userIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const unreadMessages = await prisma.chat.findMany({
      where: {
        to: userIdStr,
        read: false,
      },
      include: {
        conversation: true,
      },
    });

    const counts: Record<string, number> = {
      JobSeekerAd: 0,
      EmployerAd: 0,
      SellerAd: 0,
      DigitalAd: 0,
    };

    for (const msg of unreadMessages) {
      const adType = msg.conversation?.adType;
      if (adType && counts.hasOwnProperty(adType)) {
        counts[adType as keyof typeof counts]++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        karjo: counts.JobSeekerAd || 0,
        karfarma: counts.EmployerAd || 0,
        agahi: counts.SellerAd || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ۷. تعداد پیام‌های خوانده نشده به تفکیک هر مکالمه
// ------------------------------------------------------------
export const getUnreadDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    if (!userIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const unreadMessages = await prisma.chat.findMany({
      where: {
        to: userIdStr,
        read: false,
      },
      include: {
        conversation: true,
      },
    });

    const details: Record<string, number> = {};
    for (const msg of unreadMessages) {
      const convId = msg.conversation?.id;
      if (convId) {
        details[convId] = (details[convId] || 0) + 1;
      }
    }

    res.status(200).json({ success: true, data: details });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ۸. علامت زدن پیام‌های یک مکالمه به عنوان خوانده شده
// ------------------------------------------------------------
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { userId, conversationId } = req.body;

    if (!userId || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "userId و conversationId الزامی هستند",
      });
    }

    const result = await prisma.chat.updateMany({
      where: {
        to: userId,
        conversationId: conversationId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} پیام به عنوان خوانده شده علامت زده شد`,
    });
  } catch (err: any) {
    console.error("Error in markMessagesAsRead:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
