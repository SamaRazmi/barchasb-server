const Session = require("../models/Session");

exports.getUserSessions = async (req, res) => {
  try {
    // گرفتن جلسات فعال کاربر
    const sessions = await Session.find({
      user: req.user.id,
      isActive: true,
    })
      .sort({ lastActiveAt: -1 })
      .select("deviceInfo createdAt lastActiveAt isRead"); // ✅ isRead هم برگردانده می‌شود

    // محاسبه تعداد جلسات نخوانده (فعال و isRead:false)
    const unreadCount = sessions.filter((s) => !s.isRead).length;

    return res.json({
      unreadCount, // ✅ تعداد کل نخوانده‌ها
      sessions: sessions.map((s) => ({
        id: s._id,
        deviceType: s.deviceInfo.deviceType,
        browser: s.deviceInfo.browser,
        os: s.deviceInfo.os,
        ip: s.deviceInfo.ip,
        createdAt: s.createdAt,
        lastActiveAt: s.lastActiveAt,
        isRead: s.isRead, // ✅ وضعیت خوانده شده هر جلسه
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
    );

    return res.json({ message: "session removed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.logoutAllSessions = async (req, res) => {
  try {
    await Session.updateMany({ user: req.user.id }, { isActive: false });

    return res.json({ message: "all sessions closed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ تابع جدید: علامت‌گذاری یک جلسه به عنوان "خوانده شده"
exports.markSessionAsRead = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isActive: true },
      { isRead: true },
      { new: true }, // برگرداندن سند به‌روز شده
    );

    if (!session) {
      return res
        .status(404)
        .json({ error: "session not found or already inactive" });
    }

    return res.json({
      message: "session marked as read",
      isRead: session.isRead,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
