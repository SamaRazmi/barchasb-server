import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";

// ===== S3 client (فقط برای آپلود) =====
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT!,
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

// ===== helper =====
const generateFileName = (originalname: string) => {
  const ext = path.extname(originalname);
  const name = crypto.randomBytes(16).toString("hex");
  return `${name}${ext}`;
};

// ===== تصاویر =====
export const imagesUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `images/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// ===== فایل‌ها (PDF + Word only) =====
export const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `files/${generateFileName(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فایل باید PDF یا Word باشد"));
    }
  },
});

// ===== تبدیل آدرس S3 به دامنه سفارشی (برای ذخیره در دیتابیس) =====
/**
 * آدرس فایل را از دامنه اصلی (LIARA_ENDPOINT) به دامنه سفارشی تبدیل می‌کند
 * @param {string} originalUrl - آدرس اصلی S3 (مثلاً https://storage.c2.liara.site/...)
 * @returns {string} - آدرس با دامنه barchasb-admin-server.ir
 */
export function transformS3Url(originalUrl: string) {
  if (!originalUrl) return originalUrl;
  // جایگزینی دامنه ذخیره‌سازی ابری با دامنه نهایی برای دیتابیس
  return originalUrl.replace(
    /https?:\/\/([^\/]+)\.storage\.c2\.liara\.site/,
    "https://barchasb-admin-server.ir",
  );
}

/**
 * فایل‌های آپلود شده (آرایه یا تک شیء) را گرفته و location آن‌ها را تبدیل می‌کند
 * @param {object|object[]} files - خروجی req.files یا req.file
 * @returns {object|object[]} - همان فایل‌ها با location اصلاح شده (مناسب برای ذخیره در دیتابیس)
 */
export function transformFileUrls(files: any) {
  if (!files) return files;
  if (Array.isArray(files)) {
    return files.map((file) => ({
      ...file,
      location: transformS3Url(file.location),
    }));
  } else {
    return {
      ...files,
      location: transformS3Url(files.location),
    };
  }
}
