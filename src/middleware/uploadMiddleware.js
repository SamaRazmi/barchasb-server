import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multerS3 from "multer-s3"; // multerS3 هنوز می‌تونه با S3Client v3 کار کنه

// ساخت S3Client برای Liara Object Storage
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT, // مثال: "https://s3.liara.ir"
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

// Helper برای آپلود فایل‌ها (می‌تونید اینو بعداً جداگانه استفاده کنید)
export const uploadFileToS3 = async (file, folder = "files") => {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer, // multer باید فایل رو به صورت buffer بده
      ContentType: file.mimetype,
    },
  });

  return await upload.done();
};

// Middleware برای عکس پروفایل
export const avatarUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Middleware برای فایل‌ها
export const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.LIARA_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `files/${Date.now()}-${file.originalname}`);
    },
  }),
});
