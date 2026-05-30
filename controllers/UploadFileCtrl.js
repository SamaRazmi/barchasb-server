import UserProfile from "../models/UserProfile.js";

/**
 * آپلود یک فایل PDF یا Word
 */
export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "فایلی ارسال نشده" });
    }

    // مثال: ذخیره در UserProfile (اختیاری)
    // const profile = await UserProfile.findOneAndUpdate(
    //   { user: req.user.id },
    //   { resumeFile: req.file.location },
    //   { new: true, upsert: true }
    // );

    res.status(200).json({
      msg: "فایل با موفقیت آپلود شد",
      fileUrl: req.file.location,
      originalName: req.file.originalname,
      // profile,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

/**
 * آپلود چند فایل PDF یا Word
 */
export const uploadMultipleFiles = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ msg: "فایلی ارسال نشده" });
    }

    const uploadedFiles = files.map((f) => ({
      fileUrl: f.location,
      originalName: f.originalname,
    }));

    // مثال: ذخیره در UserProfile (اختیاری)
    // const profile = await UserProfile.findOneAndUpdate(
    //   { user: req.user.id },
    //   { $push: { portfolioFiles: { $each: uploadedFiles.map(f => f.fileUrl) } } },
    //   { new: true, upsert: true }
    // );

    res.status(200).json({
      msg: "فایل‌ها با موفقیت آپلود شدند",
      files: uploadedFiles,
      // profile,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "خطای سرور" });
  }
};
