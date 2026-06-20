import dotenv from "dotenv";
dotenv.config();

import multer, { FileFilterCallback } from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multerS3 from "multer-s3";
import { Request } from "express";

// ============================================
// 1. ساخت S3Client
// ============================================
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT, // مثال: "https://s3.liara.ir"
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

// ============================================
// 2. تابع آپلود عمومی (با buffer)
// ============================================
interface UploadFileParams {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export const uploadFileToS3 = async (
  file: UploadFileParams,
  folder: string = "files",
) => {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.LIARA_BUCKET_NAME!,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  return await upload.done();
};

// ============================================
// 3. Middleware برای عکس پروفایل (با multerS3)
// ============================================
export const avatarUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME!,
    key: (req: Request, file: Express.Multer.File, cb) => {
      cb(null, `images/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فرمت فایل مجاز نیست (فقط JPEG, PNG, WEBP)"));
    }
  },
});

// ============================================
// 4. Middleware برای فایل‌های عمومی
// ============================================
export const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME!,
    key: (req: Request, file: Express.Multer.File, cb) => {
      cb(null, `files/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    // مجاز: هر نوع فایل (در صورت نیاز محدود کنید)
    cb(null, true);
  },
});
