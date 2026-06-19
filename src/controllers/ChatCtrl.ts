import { Request, Response } from "express";
import Chat from "../models/Chat";
import Conversation from "../models/Conversation";
import NodeCache from "node-cache";

// ====== Redis Mock (بدون نیاز به redis واقعی) ======
const redis = {
  hget: async (key: string, field: string) => {
    return null;
  },
  hset: async (key: string, field: string, value: any) => {
    return 1;
  },
  hdel: async (key: string, field: string) => {
    return 1;
  },
  publish: async (channel: string, message: string) => {
    console.log(`📨 [Redis Mock] Publish to ${channel}`);
    return 1;
  },
  hgetall: async (key: string) => {
    return {};
  },
  setex: async (key: string, seconds: number, value: string) => {
    return "OK";
  },
  expire: async (key: string, seconds: number) => {
    return 1;
  },
  del: async (key: string) => {
    return 1;
  },
};
// ===================================================

/**
 * ارسال پیام و آپدیت Conversation
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { from, to, adId, adType, content, type } = req.body;

    if (!from || !to || !adId || !adType || !content) {
      return res.status(400).json({
        success: false,
        message: "همه فیلدها الزامی هستند",
      });
    }

    let conv = await Conversation.findOne({
      adId,
      adType,
      participants: { $all: [from, to] },
    });

    if (conv) {
      conv.lastMessage = content;
      conv.updatedAt = new Date();
      await conv.save();
    } else {
      conv = await Conversation.create({
        participants: [from, to],
        adId,
        adType,
        lastMessage: content,
      });
    }

    const message = await Chat.create({
      from,
      to,
      adId,
      adType,
      conversationId: conv._id,
      content,
      type,
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

/**
 * گرفتن پیام‌های یک آگهی مشخص بین دو کاربر
 */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { adType, adId, userId1, userId2 } = req.params;

    const messages = await Chat.find({
      adType,
      adId,
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("from to", "name");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * وضعیت آنلاین / آخرین بازدید
 */
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

/**
 * گرفتن لیست مکالمات یک کاربر
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    const conversations = await Conversation.find({
      participants: userIdStr,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "name");

    res.status(200).json({ success: true, conversations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * تایپینگ (typing) برای realtime
 */
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

// ======================= NEW =======================

/**
 * دریافت تعداد پیام‌های خوانده نشده برای هر adType
 */
export const getUnreadCounts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    if (!userIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const unreadMessages = await Chat.find({ to: userIdStr, read: false })
      .populate("conversationId")
      .lean();

    const counts = { JobSeekerAd: 0, EmployerAd: 0, SellerAd: 0 };

    for (const msg of unreadMessages) {
      const conv = msg.conversationId as any;
      const adType = conv?.adType;
      if (adType && counts.hasOwnProperty(adType)) {
        counts[adType as keyof typeof counts]++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        karjo: counts.JobSeekerAd,
        karfarma: counts.EmployerAd,
        agahi: counts.SellerAd,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * دریافت تعداد پیام‌های خوانده نشده برای هر مکالمه
 */
export const getUnreadDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdStr = typeof userId === "string" ? userId : userId?.[0] || "";

    if (!userIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    const unreadMessages = await Chat.find({ to: userIdStr, read: false })
      .populate("conversationId")
      .lean();

    const details: any = {};
    for (const msg of unreadMessages) {
      const conv = msg.conversationId as any;
      const convId = conv?._id?.toString();
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

/**
 * علامت زدن تمام پیام‌های یک مکالمه به عنوان خوانده شده
 */
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { userId, conversationId } = req.body;
    if (!userId || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "userId و conversationId الزامی هستند",
      });
    }

    const result = await Chat.updateMany(
      { to: userId, conversationId, read: false },
      { $set: { read: true } },
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} پیام به عنوان خوانده شده علامت زده شد`,
    });
  } catch (err: any) {
    console.error("Error in markMessagesAsRead:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
