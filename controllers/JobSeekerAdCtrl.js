const mongoose = require("mongoose");
const JobSeekerAd = require("../models/JobSeekerAd");
const { transformFileUrls, transformS3Url } = require("../middleware/upload");
const fs = require("fs").promises;
const path = require("path");

//
// 📌 ایجاد آگهی جوینده کار (عکس‌ها + دیتا)
//
exports.createJobSeekerAd = async (req, res) => {
  console.log("\n🚀 createJobSeekerAd START");
  console.log("Headers:", req.headers);
  console.log("Body received:", req.body);
  console.log("Files received:", req.files);

  try {
    const updateData = { ...req.body };

    // ✅ پردازش عکس‌ها با تبدیل آدرس به دامنه سفارشی
    let uploadedImages = req.files?.images || [];
    if (uploadedImages.length > 0) {
      uploadedImages = transformFileUrls(uploadedImages);
    }

    const images = uploadedImages.map((file, i) => ({
      url: file.location || file.path || "",
      isMain: i === 0,
    }));

    if (images.length > 0) {
      updateData.images = images;
    }

    console.log("Processed images:", images);

    // ✅ پردازش skills
    let skills = req.body.skills || [];

    if (typeof skills === "string") {
      skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(skills)) skills = [];
    updateData.skills = skills;

    console.log("Final skills:", skills);

    // ✅ تبدیل Boolean ها
    const toBool = (v) => v === "true" || v === true;

    const isLookingForRemote = toBool(req.body.isLookingForRemote);
    const openToChat = toBool(req.body.openToChat);

    delete updateData.isLookingForRemote;
    delete updateData.openToChat;

    // 📌 ساخت آگهی
    const ad = new JobSeekerAd({
      owner: req.user?._id || req.body.owner,
      isLookingForRemote,
      openToChat,
      ...updateData,
    });

    await ad.save();

    console.log("✅ JobSeekerAd created successfully");
    res.status(201).json(ad);
  } catch (err) {
    console.error("❌ ERROR CREATING JOB SEEKER AD:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

//
// 📌 آپلود رزومه (API جدا)
//
exports.uploadResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "فایل رزومه ارسال نشده است" });
    }

    // تبدیل آدرس رزومه به دامنه سفارشی
    const resumePath = req.file.location
      ? transformS3Url(req.file.location)
      : req.file.path || "";

    const ad = await JobSeekerAd.findByIdAndUpdate(
      id,
      { resumeFile: resumePath },
      { new: true },
    );

    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }

    res.json({ message: "رزومه با موفقیت آپلود شد", resumeFile: resumePath });
  } catch (err) {
    console.error("❌ ERROR UPLOADING RESUME:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

//
// 📌 آپلود نمونه‌کار (API جدا)
//
exports.uploadWorkSample = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "فایل نمونه‌کار ارسال نشده است" });
    }

    // تبدیل آدرس نمونه کار به دامنه سفارشی
    const workSamplePath = req.file.location
      ? transformS3Url(req.file.location)
      : req.file.path || "";

    const ad = await JobSeekerAd.findByIdAndUpdate(
      id,
      { workSampleFile: workSamplePath },
      { new: true },
    );

    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }

    res.json({
      message: "نمونه‌کار با موفقیت آپلود شد",
      workSampleFile: workSamplePath,
    });
  } catch (err) {
    console.error("❌ ERROR UPLOADING WORK SAMPLE:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

//
// 📌 دریافت همه آگهی‌های جوینده کار
//
exports.getAllJobSeekerAds = async (req, res) => {
  try {
    const ads = await JobSeekerAd.find().populate("owner", "fullName");
    res.json(ads);
  } catch (err) {
    console.error("❌ ERROR GETTING ALL JOB SEEKER ADS:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

//
// 📌 دریافت آگهی تکی
//
exports.getJobSeekerAdById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const ad = await JobSeekerAd.findById(id).populate(
      "owner",
      "fullName phoneNumber",
    );

    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }

    res.json(ad);
  } catch (err) {
    console.error("❌ ERROR GETTING JOB SEEKER AD BY ID:", err);
    res.status(500).json({ error: "خطای سرور، لطفا دوباره تلاش کنید." });
  }
};

// 📌 گرفتن آگهی‌های یک کاربر خاص
exports.getAdsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params; // آیدی کاربر
    const ads = await JobSeekerAd.find({ owner: ownerId }).populate(
      "owner",
      "fullName phoneNumber",
    );
    res.status(200).json({ status: "success", ads });
  } catch (error) {
    console.error("❌ ERROR GETTING JOB SEEKER ADS BY OWNER:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// گرفتن یک آگهی مشخص از یک کاربر مشخص
exports.getJobSeekerAdByOwnerAndId = async (req, res) => {
  try {
    const { ownerId, adId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(adId) ||
      !mongoose.Types.ObjectId.isValid(ownerId)
    ) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const ad = await JobSeekerAd.findOne({
      _id: adId,
      owner: ownerId,
    }).populate("owner", "fullName phoneNumber");

    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", ad });
  } catch (err) {
    console.error("❌ ERROR GETTING JOB SEEKER AD BY OWNER AND ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ویرایش آگهی یک کاربر مشخص
exports.updateJobSeekerAd = async (req, res) => {
  try {
    const { ownerId, adId } = req.params;

    // تصاویر جدید (در صورت وجود) با تبدیل آدرس
    let newUploadedFiles = req.files || [];
    let newImages = [];
    if (newUploadedFiles.length > 0) {
      const transformed = transformFileUrls(newUploadedFiles);
      newImages = transformed.map((file) => ({
        url: file.location || file.path,
        isMain: false, // بعداً بررسی می‌کنیم کدوم اصلیه
      }));
    }

    // تصاویر قدیمی از فرانت (imagesFromApi)
    let imagesFromApi = [];
    if (req.body.imagesFromApi) {
      try {
        imagesFromApi = JSON.parse(req.body.imagesFromApi);
      } catch (err) {
        console.error("❌ Invalid imagesFromApi JSON:", err);
        imagesFromApi = [];
      }
    }

    // ترکیب تصاویر
    const finalImages = [
      ...imagesFromApi.map((img) => ({
        url: img.url,
        isMain: img.isMain || false,
      })),
      ...newImages,
    ];

    // اطمینان از اینکه حداقل یک تصویر اصلی وجود داشته باشد
    if (!finalImages.some((img) => img.isMain) && finalImages.length > 0) {
      finalImages[0].isMain = true;
    }

    // پردازش skills
    let skills = req.body.skills || [];
    if (typeof skills === "string") {
      skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(skills)) skills = [];

    // تبدیل Boolean ها
    const toBool = (v) => v === "true" || v === true;
    const isLookingForRemote = toBool(req.body.isLookingForRemote);
    const openToChat = toBool(req.body.openToChat);

    const updateData = {
      ...req.body,
      images: finalImages.length > 0 ? finalImages : undefined,
      skills,
      isLookingForRemote,
      openToChat,
    };

    const updatedAd = await JobSeekerAd.findOneAndUpdate(
      { _id: adId, owner: ownerId },
      updateData,
      { new: true },
    );

    if (!updatedAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err) {
    console.error("❌ ERROR UPDATING JOB SEEKER AD:", err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * حذف آگهی جوینده کار (فقط مالک)
 * @route DELETE /api/ads/jobseeker/:adId
 */
exports.deleteJobSeekerAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id; // از توکن

    const ad = await JobSeekerAd.findOne({ _id: adId, owner: userId });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا دسترسی ندارید." });
    }

    // حذف فایل‌های فیزیکی تصاویر
    if (ad.images && ad.images.length > 0) {
      for (const img of ad.images) {
        if (img.url && !img.url.startsWith("http")) {
          const filePath = path.join(__dirname, "..", img.url);
          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.warn(`حذف فایل ${filePath} ناموفق:`, err.message);
          }
        }
      }
    }

    // همچنین فایل رزومه و نمونه‌کار (اگر آدرس محلی دارند) حذف شوند
    if (ad.resumeFile && !ad.resumeFile.startsWith("http")) {
      const resumePath = path.join(__dirname, "..", ad.resumeFile);
      try {
        await fs.unlink(resumePath);
      } catch (err) {
        console.warn(`حذف رزومه ${resumePath} ناموفق:`, err.message);
      }
    }
    if (ad.workSampleFile && !ad.workSampleFile.startsWith("http")) {
      const workPath = path.join(__dirname, "..", ad.workSampleFile);
      try {
        await fs.unlink(workPath);
      } catch (err) {
        console.warn(`حذف نمونه کار ${workPath} ناموفق:`, err.message);
      }
    }

    await JobSeekerAd.deleteOne({ _id: adId });
    res.status(200).json({ message: "آگهی جوینده کار با موفقیت حذف شد." });
  } catch (err) {
    console.error("❌ ERROR DELETING JOB SEEKER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};
