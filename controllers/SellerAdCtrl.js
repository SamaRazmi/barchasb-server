const SellerAd = require("../models/SellerAd");
const { transformFileUrls } = require("../middleware/upload");
const fs = require("fs").promises;
const path = require("path");

// ایجاد آگهی فروشنده
exports.createSellerAd = async (req, res) => {
  try {
    // 🔹 تبدیل آدرس تصاویر به دامنه سفارشی
    let uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }

    // 🔹 آرایه تصاویر از req.files (تبدیل شده)
    const images = uploadedFiles.map((file, i) => ({
      url: file.location || file.path,
      isMain: i === Number(req.body.mainImageIndex || 0),
    }));

    // 🔹 تبدیل Boolean ها
    const isFixedPrice = req.body.isFixedPrice === "true";
    const isNegotiable = req.body.isNegotiable === "true";
    const hasWarranty = req.body.hasWarranty === "true";
    const isShippable = req.body.isShippable === "true";

    // 🔹 تبدیل قیمت به Number (حذف ویرگول)
    const priceIRT = Number((req.body.priceIRT || "0").replace(/,/g, "")) || 0;

    // 🔹 extraFeatures از JSON string
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures = JSON.parse(req.body.extraFeatures);
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
      }
    }

    const ad = new SellerAd({
      title: req.body.title,
      category: req.body.category,
      state: req.body.state,
      city: req.body.city,
      person: req.body.person || "self",
      priceIRT,
      isFixedPrice,
      isNegotiable,
      hasWarranty,
      isShippable,
      extraFeatures,
      images,
      owner: req.body.owner,
      adStatus: "pending",
      paymentMethod: req.body.paymentMethod || "Bank card",
    });

    await ad.save();
    res.status(201).json({ message: "Seller ad saved successfully", ad });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Seller ad save failed", error: err.message });
  }
};

// دریافت همه آگهی‌ها
exports.getAllSellerAds = async (req, res) => {
  try {
    const ads = await SellerAd.find().populate("owner", "fullName phoneNumber");
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// دریافت یک آگهی فروشنده
exports.getSellerAdById = async (req, res) => {
  try {
    const adId = req.params.id;

    if (!adId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "آدرس آگهی نامعتبر است" });
    }

    const ad = await SellerAd.findById(adId).populate(
      "owner",
      "fullName phoneNumber",
    );

    if (!ad) {
      return res.status(404).json({ message: "آگهی یافت نشد" });
    }

    res.json(ad);
  } catch (err) {
    console.error("خطا در دریافت آگهی:", err);
    res.status(500).json({ error: err.message });
  }
};

// گرفتن آگهی‌های یک کاربر خاص
exports.getAdsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const ads = await SellerAd.find({ owner: ownerId }).populate(
      "owner",
      "fullName phoneNumber",
    );
    res.status(200).json({ status: "success", ads });
  } catch (err) {
    console.error("❌ ERROR GETTING SELLER ADS BY OWNER:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 🔹 گرفتن یک آگهی مشخص از یک کاربر مشخص
exports.getSellerAdByOwnerAndId = async (req, res) => {
  try {
    const { ownerId, adId } = req.params;

    const ad = await SellerAd.findOne({ _id: adId, owner: ownerId }).populate(
      "owner",
      "fullName phoneNumber",
    );

    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", ad });
  } catch (err) {
    console.error("❌ ERROR GETTING SELLER AD BY OWNER AND ID:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 🔹 ویرایش آگهی یک کاربر مشخص
exports.updateSellerAd = async (req, res) => {
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

    // تعیین تصویر اصلی (بر اساس mainImageIndex اگر موجود باشد)
    const mainIndex = Number(req.body.mainImageIndex || 0);
    if (finalImages.length > 0) {
      finalImages.forEach((img, i) => (img.isMain = i === mainIndex));
      // اگر mainImageIndex اشتباه باشه، حداقل اولین تصویر اصلیه
      if (!finalImages.some((img) => img.isMain)) finalImages[0].isMain = true;
    }

    // extraFeatures از JSON string
    let extraFeatures = {};
    if (req.body.extraFeatures) {
      try {
        extraFeatures = JSON.parse(req.body.extraFeatures);
      } catch (err) {
        console.warn("Invalid JSON in extraFeatures:", err);
      }
    }

    const updatedAd = await SellerAd.findOneAndUpdate(
      { _id: adId, owner: ownerId },
      {
        ...req.body,
        images: finalImages.length > 0 ? finalImages : undefined,
        extraFeatures,
      },
      { new: true },
    );

    if (!updatedAd) return res.status(404).json({ message: "آگهی یافت نشد" });

    res.status(200).json({ status: "success", updatedAd });
  } catch (err) {
    console.error("❌ ERROR UPDATING SELLER AD:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
/**
 * حذف آگهی فروشنده (فقط مالک)
 * @route DELETE /api/ads/seller/:adId
 */
exports.deleteSellerAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id; // از توکن احراز هویت گرفته می‌شود

    // یافتن آگهی و اطمینان از تعلق به کاربر جاری
    const ad = await SellerAd.findOne({ _id: adId, owner: userId });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "آگهی یافت نشد یا شما دسترسی حذف ندارید." });
    }

    // حذف فایل‌های فیزیکی تصاویر (در صورت ذخیره محلی)
    if (ad.images && ad.images.length > 0) {
      for (const img of ad.images) {
        if (img.url && !img.url.startsWith("http")) {
          // مسیر محلی (مثال: uploads/xxxx.jpg)
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

    // حذف سند آگهی از دیتابیس
    await SellerAd.deleteOne({ _id: adId });

    res.status(200).json({ message: "آگهی با موفقیت حذف شد." });
  } catch (err) {
    console.error("❌ ERROR DELETING SELLER AD:", err);
    res
      .status(500)
      .json({ message: "خطای سرور در حذف آگهی", error: err.message });
  }
};
