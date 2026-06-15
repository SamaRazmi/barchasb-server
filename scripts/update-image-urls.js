// scripts/update-image-urls.js
require("dotenv").config();
const mongoose = require("mongoose");

// مدل‌ها (مسیرها را بر اساس ساختار پروژه خود اصلاح کنید)
const DigitalAd = require("../models/DigitalAd");
const EmployerAd = require("../models/EmployerAd");
const JobSeekerAd = require("../models/JobSeekerAd");
const SellerAd = require("../models/SellerAd"); // ✅ اضافه شد

// دامنه قدیمی کامل (شامل زیردامنه باکت)
const OLD_DOMAIN = "barchasb-server-admin.ir";
const NEW_DOMAIN = "barchasb-admin-server.ir";

function replaceUrlDomain(url) {
  if (!url || typeof url !== "string") return url;
  // جایگزینی دامنه قدیمی با جدید
  return url.replace(
    new RegExp(OLD_DOMAIN.replace(/\./g, "\\."), "g"),
    NEW_DOMAIN,
  );
}

function updateImagesArray(images) {
  if (!Array.isArray(images)) return images;
  return images.map((img) => {
    if (img.url) {
      return { ...img, url: replaceUrlDomain(img.url) };
    }
    return img;
  });
}

async function updateAll() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ متصل به دیتابیس");

    // 1. به‌روزرسانی DigitalAd
    let updatedDigital = 0;
    const digitalAds = await DigitalAd.find();
    for (const ad of digitalAds) {
      let modified = false;
      if (ad.images && ad.images.length) {
        const newImages = updateImagesArray(ad.images);
        if (JSON.stringify(ad.images) !== JSON.stringify(newImages)) {
          ad.images = newImages;
          modified = true;
        }
      }
      if (modified) {
        await ad.save();
        updatedDigital++;
        console.log(`📝 DigitalAd ${ad._id} به‌روز شد`);
      }
    }
    console.log(`✅ DigitalAd: ${updatedDigital} سند به‌روز شد`);

    // 2. به‌روزرسانی EmployerAd
    let updatedEmployer = 0;
    const employerAds = await EmployerAd.find();
    for (const ad of employerAds) {
      let modified = false;
      if (ad.images && ad.images.length) {
        const newImages = updateImagesArray(ad.images);
        if (JSON.stringify(ad.images) !== JSON.stringify(newImages)) {
          ad.images = newImages;
          modified = true;
        }
      }
      if (modified) {
        await ad.save();
        updatedEmployer++;
        console.log(`📝 EmployerAd ${ad._id} به‌روز شد`);
      }
    }
    console.log(`✅ EmployerAd: ${updatedEmployer} سند به‌روز شد`);

    // 3. به‌روزرسانی JobSeekerAd
    let updatedJobSeeker = 0;
    const jobSeekerAds = await JobSeekerAd.find();
    for (const ad of jobSeekerAds) {
      let modified = false;
      if (ad.images && ad.images.length) {
        const newImages = updateImagesArray(ad.images);
        if (JSON.stringify(ad.images) !== JSON.stringify(newImages)) {
          ad.images = newImages;
          modified = true;
        }
      }
      // فایل‌های جداگانه (رزومه و نمونه کار)
      if (ad.resumeFile && replaceUrlDomain(ad.resumeFile) !== ad.resumeFile) {
        ad.resumeFile = replaceUrlDomain(ad.resumeFile);
        modified = true;
      }
      if (
        ad.workSampleFile &&
        replaceUrlDomain(ad.workSampleFile) !== ad.workSampleFile
      ) {
        ad.workSampleFile = replaceUrlDomain(ad.workSampleFile);
        modified = true;
      }
      if (modified) {
        await ad.save();
        updatedJobSeeker++;
        console.log(`📝 JobSeekerAd ${ad._id} به‌روز شد`);
      }
    }
    console.log(`✅ JobSeekerAd: ${updatedJobSeeker} سند به‌روز شد`);

    // 4. به‌روزرسانی SellerAd
    let updatedSeller = 0;
    const sellerAds = await SellerAd.find();
    for (const ad of sellerAds) {
      let modified = false;
      if (ad.images && ad.images.length) {
        const newImages = updateImagesArray(ad.images);
        if (JSON.stringify(ad.images) !== JSON.stringify(newImages)) {
          ad.images = newImages;
          modified = true;
        }
      }
      if (modified) {
        await ad.save();
        updatedSeller++;
        console.log(`📝 SellerAd ${ad._id} به‌روز شد`);
      }
    }
    console.log(`✅ SellerAd: ${updatedSeller} سند به‌روز شد`);

    console.log("🎉 تمام اسناد با موفقیت به‌روزرسانی شدند");
    process.exit(0);
  } catch (err) {
    console.error("❌ خطا:", err);
    process.exit(1);
  }
}

updateAll();
