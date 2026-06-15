const EmployerAd = require("../models/EmployerAd");
const { transformFileUrls } = require("../middleware/upload");
const fs = require("fs").promises;
const path = require("path");

// 📌 ایجاد آگهی کارفرما
exports.createEmployerAd = async (req, res) => {
  try {
    // تبدیل آدرس تصاویر به دامنه سفارشی
    let uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }

    const images = uploadedFiles.map((file, i) => ({
      url: file.location,
      isMain: i === 0,
    }));

    let jobDetails = req.body.jobDetails;
    if (typeof jobDetails === "string") {
      try {
        jobDetails = JSON.parse(jobDetails.trim());
      } catch (err) {
        console.error("❌ Invalid jobDetails JSON:", err);
        jobDetails = [];
      }
    }
    if (!Array.isArray(jobDetails)) jobDetails = [];
    jobDetails = jobDetails.map((item) =>
      typeof item === "object" && item !== null ? item : {},
    );

    // ✅ پردازش categories (از رشته JSON به آرایه)
    let categories = req.body.categories;
    if (typeof categories === "string") {
      try {
        categories = JSON.parse(categories);
        if (!Array.isArray(categories)) categories = [];
      } catch (err) {
        console.error("❌ Invalid categories JSON:", err);
        categories = [];
      }
    } else if (!Array.isArray(categories)) {
      categories = [];
    }
    // حذف categories از req.body تا با مقدار پردازش شده تداخل نکند
    delete req.body.categories;

    const toBool = (v) => v === "true" || v === true;
    const isRemote = toBool(req.body.isRemote);
    const thursdayUntilNoon = toBool(req.body.thursdayUntilNoon);
    const enableChat = toBool(req.body.enableChat);
    const enablePhone = toBool(req.body.enablePhone);

    ["isRemote", "thursdayUntilNoon", "enableChat", "enablePhone"].forEach(
      (f) => delete req.body[f],
    );

    const ad = new EmployerAd({
      ...req.body,
      owner: req.user?._id || req.body.owner,
      images,
      jobDetails,
      isRemote,
      thursdayUntilNoon,
      enableChat,
      enablePhone,
      categories, // ✅ آرایه دسته‌های اصلی با زیردسته‌ها
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    console.error("❌ ERROR CREATING EMPLOYER AD:", err);
    res.status(400).json({ error: err.message });
  }
};

// 📌 دریافت همه آگهی‌ها
exports.getAllEmployerAds = async (req, res) => {
  try {
    const ads = await EmployerAd.find().populate("owner", "fullName");
    res.json(ads);
  } catch (err) {
    console.error("❌ ERROR GETTING ALL ADS:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 دریافت یک آگهی با ID
exports.getEmployerAdById = async (req, res) => {
  try {
    const ad = await EmployerAd.findById(req.params.id).populate(
      "owner",
      "fullName phoneNumber",
    );
    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
    res.json(ad);
  } catch (err) {
    console.error("❌ ERROR GETTING AD BY ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// گرفتن آگهی‌های یک کاربر خاص
exports.getAdsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const ads = await EmployerAd.find({ owner: ownerId });
    res.status(200).json({ status: "success", ads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// گرفتن یک آگهی مشخص از یک کاربر مشخص
exports.getEmployerAdByOwnerAndId = async (req, res) => {
  try {
    const { ownerId, adId } = req.params;
    const ad = await EmployerAd.findOne({ _id: adId, owner: ownerId }).populate(
      "owner",
      "fullName phoneNumber",
    );
    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
    res.status(200).json({ status: "success", ad });
  } catch (err) {
    console.error("❌ ERROR GETTING AD BY OWNER AND ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// ویرایش آگهی یک کاربر مشخص – نسخه اصلاح شده با پشتیبانی از imagesFromApi و categories
exports.updateEmployerAd = async (req, res) => {
  try {
    const { ownerId, adId } = req.params;

    // تصاویر جدید (در صورت وجود) با تبدیل آدرس
    let newUploadedFiles = req.files || [];
    let newImages = [];
    if (newUploadedFiles.length > 0) {
      const transformed = transformFileUrls(newUploadedFiles);
      newImages = transformed.map((file) => ({
        url: file.location,
        isMain: false,
      }));
    }

    // پردازش jobDetails
    let jobDetails = req.body.jobDetails;
    if (typeof jobDetails === "string") {
      try {
        jobDetails = JSON.parse(jobDetails.trim());
      } catch (err) {
        console.error("❌ Invalid jobDetails JSON:", err);
        jobDetails = [];
      }
    }
    if (!Array.isArray(jobDetails)) jobDetails = [];
    jobDetails = jobDetails.map((item) =>
      typeof item === "object" && item !== null ? item : {},
    );

    // ✅ پردازش categories (برای ویرایش)
    let categories = req.body.categories;
    if (typeof categories === "string") {
      try {
        categories = JSON.parse(categories);
        if (!Array.isArray(categories)) categories = [];
      } catch (err) {
        console.error("❌ Invalid categories JSON:", err);
        categories = [];
      }
    } else if (!Array.isArray(categories)) {
      categories = [];
    }
    delete req.body.categories;

    const toBool = (v) => v === "true" || v === true;
    const isRemote = toBool(req.body.isRemote);
    const thursdayUntilNoon = toBool(req.body.thursdayUntilNoon);
    const enableChat = toBool(req.body.enableChat);
    const enablePhone = toBool(req.body.enablePhone);

    ["isRemote", "thursdayUntilNoon", "enableChat", "enablePhone"].forEach(
      (f) => delete req.body[f],
    );

    let imagesFromApi = [];
    if (req.body.imagesFromApi) {
      try {
        imagesFromApi = JSON.parse(req.body.imagesFromApi);
      } catch (err) {
        console.error("❌ Invalid imagesFromApi JSON:", err);
        imagesFromApi = [];
      }
    }

    const existingAd = await EmployerAd.findOne({ _id: adId, owner: ownerId });
    if (!existingAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    const finalImages = [
      ...imagesFromApi.map((img) => ({
        url: img.url,
        isMain: img.isMain || false,
      })),
      ...newImages,
    ];

    if (!finalImages.some((img) => img.isMain) && finalImages.length > 0) {
      finalImages[0].isMain = true;
    }

    const updatedAd = await EmployerAd.findOneAndUpdate(
      { _id: adId, owner: ownerId },
      {
        ...req.body,
        images: finalImages,
        jobDetails,
        isRemote,
        thursdayUntilNoon,
        enableChat,
        enablePhone,
        categories, // ✅ مقدار پردازش شده
      },
      { new: true },
    );

    res.status(200).json({ status: "success", updatedAd });
  } catch (err) {
    console.error("❌ ERROR UPDATING AD:", err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * حذف آگهی کارفرما (فقط مالک)
 * @route DELETE /api/ads/employer/:adId
 */
exports.deleteEmployerAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id; // از توکن احراز هویت

    const ad = await EmployerAd.findOne({ _id: adId, owner: userId });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا دسترسی ندارید." });
    }

    // حذف فایل‌های فیزیکی تصاویر (در صورت ذخیره محلی)
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
        // اگر از فضای ابری استفاده می‌کنید، تابع حذف از ابر را اینجا فراخوانی کنید
      }
    }

    await EmployerAd.deleteOne({ _id: adId });
    res.status(200).json({ message: "آگهی کارفرما با موفقیت حذف شد." });
  } catch (err) {
    console.error("❌ ERROR DELETING EMPLOYER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};
