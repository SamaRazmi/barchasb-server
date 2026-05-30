const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");
const Redis = require("ioredis");
const redis = new Redis();

/**
 * ارسال پیام و آپدیت Conversation
 */
exports.sendMessage = async (req, res) => {
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

    const isOnline = await redis.hget("onlineUsers", to);
    if (isOnline) {
      await redis.publish(`chat:${to}`, JSON.stringify(message));
    }

    res.status(201).json({
      success: true,
      message,
      conversation: conv,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * گرفتن پیام‌های یک آگهی مشخص بین دو کاربر
 */
exports.getMessages = async (req, res) => {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * وضعیت آنلاین / آخرین بازدید
 */
exports.getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const online = await redis.hget("onlineUsers", userId);
    const lastSeen = await redis.hget("lastSeenUsers", userId);

    res.status(200).json({
      success: true,
      online: !!online,
      lastSeen: lastSeen ? new Date(+lastSeen) : null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * گرفتن لیست مکالمات یک کاربر
 */
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "name");

    res.status(200).json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * تایپینگ (typing) برای realtime
 */
exports.typingStatus = async (req, res) => {
  try {
    const { fromUserId, toUserId, isTyping } = req.body;

    const online = await redis.hget("onlineUsers", toUserId);
    if (online) {
      await redis.publish(
        `typing:${toUserId}`,
        JSON.stringify({ fromUserId, isTyping }),
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ======================= NEW =======================

/**
 * دریافت تعداد پیام‌های خوانده نشده برای هر adType (کارجو، کارفرما، آگهی)
 * مسیر: GET /chat/unread-count/:userId
 */
exports.getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId required" });

    const unreadMessages = await Chat.find({ to: userId, read: false })
      .populate("conversationId", "adType")
      .lean();

    const counts = { JobSeekerAd: 0, EmployerAd: 0, SellerAd: 0 };
    for (const msg of unreadMessages) {
      const adType = msg.conversationId?.adType;
      if (adType && counts.hasOwnProperty(adType)) counts[adType]++;
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
 * دریافت تعداد پیام‌های خوانده نشده برای هر مکالمه (بر اساس conversationId)
 * مسیر: GET /chat/unread-details/:userId
 * خروجی: { success: true, data: { "conversationId1": 2, "conversationId2": 1, ... } }
 */
exports.getUnreadDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId required" });

    const unreadMessages = await Chat.find({ to: userId, read: false })
      .populate("conversationId", "_id")
      .lean();

    const details = {};
    for (const msg of unreadMessages) {
      const convId = msg.conversationId?._id.toString();
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
 * علامت زدن تمام پیام‌های یک مکالمه به عنوان خوانده شده برای یک کاربر خاص
 * body: { userId, conversationId }
 */
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { userId, conversationId } = req.body;
    if (!userId || !conversationId) {
      return res
        .status(400)
        .json({
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
  } catch (err) {
    console.error("Error in markMessagesAsRead:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
