import multer from "multer";
import { Request } from "express";

// use memory and size limit
const storage = multer.memoryStorage();
const limits = {
  fileSize: 50 * 1024 * 1024, // max file size limit
  parts: 20,
};

// filter just for images
const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, accept: boolean) => void,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("فقط فایل‌های تصویری مجاز هستند!"), false);
  }
};

// filter for txt and pdf
const documentFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, accept: boolean) => void,
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "text/plain",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "فرمت فایل پشتیبانی نمی‌شود. (فقط PDF, TXT, JPG, PNG مجاز است)",
      ),
      false,
    );
  }
};

// middlewares
const imageUpload = multer({
  storage,
  limits: limits,
  fileFilter: imageFilter,
});
const upload = multer({ storage, limits: limits, fileFilter: documentFilter });

export { imageUpload, upload };
