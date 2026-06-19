import "dotenv/config";
import prisma from "../config/prisma";

// مدل‌ها (با Prisma)
// DigitalAd, EmployerAd, JobSeekerAd, SellerAd

// دامنه قدیمی کامل (شامل زیردامنه باکت)
const OLD_DOMAIN = "barchasb-server-admin.ir";
const NEW_DOMAIN = "barchasb-admin-server.ir";

function replaceUrlDomain(url: any): any {
  if (!url || typeof url !== "string") return url;
  return url.replace(
    new RegExp(OLD_DOMAIN.replace(/\./g, "\\."), "g"),
    NEW_DOMAIN,
  );
}

function updateImagesArray(images: any[]): any[] {
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
    console.log("✅ متصل به دیتابیس (Prisma)");

    // 1. به‌روزرسانی DigitalAd
    let updatedDigital = 0;
    const digitalAds = await prisma.digitalAd.findMany();
    for (const ad of digitalAds) {
      let modified = false;
      const images = ad.images as any[];
      if (images && images.length) {
        const newImages = updateImagesArray(images);
        if (JSON.stringify(images) !== JSON.stringify(newImages)) {
          // به‌روزرسانی با Prisma
          await prisma.digitalAd.update({
            where: { id: ad.id },
            data: { images: newImages },
          });
          modified = true;
          updatedDigital++;
          console.log(`📝 DigitalAd ${ad.id} به‌روز شد`);
        }
      }
    }
    console.log(`✅ DigitalAd: ${updatedDigital} سند به‌روز شد`);

    // 2. به‌روزرسانی EmployerAd
    let updatedEmployer = 0;
    const employerAds = await prisma.employerAd.findMany();
    for (const ad of employerAds) {
      let modified = false;
      const images = ad.images as any[];
      if (images && images.length) {
        const newImages = updateImagesArray(images);
        if (JSON.stringify(images) !== JSON.stringify(newImages)) {
          await prisma.employerAd.update({
            where: { id: ad.id },
            data: { images: newImages },
          });
          modified = true;
          updatedEmployer++;
          console.log(`📝 EmployerAd ${ad.id} به‌روز شد`);
        }
      }
    }
    console.log(`✅ EmployerAd: ${updatedEmployer} سند به‌روز شد`);

    // 3. به‌روزرسانی JobSeekerAd
    let updatedJobSeeker = 0;
    const jobSeekerAds = await prisma.jobSeekerAd.findMany();
    for (const ad of jobSeekerAds) {
      let modified = false;
      const images = ad.images as any[];
      if (images && images.length) {
        const newImages = updateImagesArray(images);
        if (JSON.stringify(images) !== JSON.stringify(newImages)) {
          // به‌روزرسانی تصاویر
          await prisma.jobSeekerAd.update({
            where: { id: ad.id },
            data: { images: newImages },
          });
          modified = true;
        }
      }
      // فایل‌های جداگانه (رزومه و نمونه کار)
      if (ad.resumeFile && replaceUrlDomain(ad.resumeFile) !== ad.resumeFile) {
        await prisma.jobSeekerAd.update({
          where: { id: ad.id },
          data: { resumeFile: replaceUrlDomain(ad.resumeFile) },
        });
        modified = true;
      }
      if (
        ad.workSampleFile &&
        replaceUrlDomain(ad.workSampleFile) !== ad.workSampleFile
      ) {
        await prisma.jobSeekerAd.update({
          where: { id: ad.id },
          data: { workSampleFile: replaceUrlDomain(ad.workSampleFile) },
        });
        modified = true;
      }
      if (modified) {
        updatedJobSeeker++;
        console.log(`📝 JobSeekerAd ${ad.id} به‌روز شد`);
      }
    }
    console.log(`✅ JobSeekerAd: ${updatedJobSeeker} سند به‌روز شد`);

    // 4. به‌روزرسانی SellerAd
    let updatedSeller = 0;
    const sellerAds = await prisma.sellerAd.findMany();
    for (const ad of sellerAds) {
      let modified = false;
      const images = ad.images as any[];
      if (images && images.length) {
        const newImages = updateImagesArray(images);
        if (JSON.stringify(images) !== JSON.stringify(newImages)) {
          await prisma.sellerAd.update({
            where: { id: ad.id },
            data: { images: newImages },
          });
          modified = true;
          updatedSeller++;
          console.log(`📝 SellerAd ${ad.id} به‌روز شد`);
        }
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
