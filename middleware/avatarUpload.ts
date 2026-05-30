// server/middleware/avatarUpload.ts
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
dotenv.config();

// ایجاد کلاینت S3 با SDK v3
const s3Client = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT, // مثلا https://objects.liara.space
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

// تنظیم multer برای گرفتن فایل‌ها در memory
const storage = multer.memoryStorage();
export const avatarUpload = multer({ storage });

// Middleware برای آپلود فایل به S3
export const uploadToS3 = async (req: any, res: any, next: any) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  const file = req.file;
  const key = `images/${Date.now()}-${file.originalname}`;

  try {
    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.LIARA_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ACL: "public-read",
      },
    });

    const result = await parallelUpload.done();

    req.fileLocation = result.Location; // مسیر فایل آپلود شده
    next();
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err });
  }
};
