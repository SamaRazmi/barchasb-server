const ReportReason = require("../models/ReportReason");

exports.getReportReasons = async (req, res) => {
  try {
    const { type = "general" } = req.query;
    const allowedTypes = [
      "general",
      "employerAd",
      "jobSeekerAd",
      "sellerAd",
      "DigitalAd",
      "chat_employerAd",
      "chat_jobSeekerAd",
      "chat_sellerAd",
      "chat_DigitalAd",
    ];
    const queryType = allowedTypes.includes(type) ? type : "general";

    let reasons = await ReportReason.find({ type: queryType, isActive: true })
      .sort({ order: 1 })
      .lean();

    if (reasons.length === 0 && queryType !== "general") {
      reasons = await ReportReason.find({ type: "general", isActive: true })
        .sort({ order: 1 })
        .lean();
    }
    res.json(reasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در دریافت لیست دلایل گزارش" });
  }
};

exports.createReportReason = async (req, res) => {
  try {
    const { type, key, label, description, order, isActive } = req.body;
    if (!type || !key || !label || !description) {
      return res
        .status(400)
        .json({ error: "فیلدهای type, key, label, description اجباری هستند" });
    }
    const newReason = new ReportReason({
      type,
      key,
      label,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    await newReason.save();
    res.status(201).json(newReason);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "دلیل با این کلید و نوع قبلاً وجود دارد" });
    }
    console.error(error);
    res.status(500).json({ error: "خطا در ایجاد دلیل گزارش" });
  }
};

exports.updateReportReason = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ReportReason.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "دلیل گزارش یافت نشد" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در بروزرسانی دلیل گزارش" });
  }
};

exports.deleteReportReason = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReportReason.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "دلیل گزارش یافت نشد" });
    res.json({ message: "دلیل گزارش حذف شد" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در حذف دلیل گزارش" });
  }
};
