const DigitalAd = require("../models/DigitalAd");
const { transformFileUrls } = require("../middleware/upload");

// ایجاد آگهی دیجیتال
exports.createDigitalAd = async (req, res) => {
  try {
    // تبدیل آدرس تصاویر به دامنه سفارشی
    let uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles = transformFileUrls(uploadedFiles);
    }

    const images = uploadedFiles.map((file, i) => ({
      url: file.location || file.path,
      isMain: i === 0,
    }));

    let requiredSkills = req.body.requiredSkills || [];
    if (typeof requiredSkills === "string") {
      try {
        requiredSkills = JSON.parse(requiredSkills.trim());
        if (!Array.isArray(requiredSkills)) requiredSkills = [];
      } catch {
        requiredSkills = [];
      }
    }

    const ad = new DigitalAd({
      ...req.body,
      images,
      requiredSkills,
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// دریافت همه آگهی‌ها
exports.getAllDigitalAds = async (req, res) => {
  try {
    const ads = await DigitalAd.find().populate("owner", "fullName");
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// دریافت یک آگهی دیجیتال
exports.getDigitalAdById = async (req, res) => {
  try {
    const ad = await DigitalAd.findById(req.params.id).populate(
      "owner",
      "fullName phoneNumber province city", // اضافه کردن province و city
    );
    if (!ad) return res.status(404).json({ message: "آگهی یافت نشد" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
