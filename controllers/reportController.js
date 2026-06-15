const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  try {
    const { targetId, reportType, reason, description } = req.body;

    // از req.user.id استفاده کنید (نه _id)
    const reporterUserId = req.user?.id;

    if (!reporterUserId) {
      return res.status(401).json({ error: "کاربر احراز هویت نشده است" });
    }
    if (!targetId || !reportType || !reason || !description) {
      return res.status(400).json({ error: "اطلاعات ناقص است" });
    }

    const newReport = new Report({
      reporterUserId,
      targetId,
      reportType,
      reason,
      description,
    });
    await newReport.save();
    res.status(201).json({ message: "گزارش شما با موفقیت ثبت شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ثبت گزارش" });
  }
};
