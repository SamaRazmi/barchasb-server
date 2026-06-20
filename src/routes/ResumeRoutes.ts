import { Router } from "express";
import ResumeCtrl from "../controllers/ResumeCtrl";
import multer from "multer";

const router = Router();

// ====== تنظیمات Multer ======
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("فقط فایل‌های PDF مجاز هستند.") as any, false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

// ====== Swagger Documentation ======

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: مدیریت رزومه‌ها
 */

/**
 * @swagger
 * /api/resume/data:
 *   post:
 *     summary: ایجاد یا بروزرسانی اطلاعات متنی رزومه
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: در صورت بروزرسانی ارسال شود
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               gender:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               address:
 *                 type: string
 *               expectedSalary:
 *                 type: string
 *               cooperationType:
 *                 type: string
 *               hasInsuranceHistory:
 *                 type: boolean
 *               willingToGoOnMission:
 *                 type: boolean
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     major:
 *                       type: string
 *                     university:
 *                       type: string
 *                     gpa:
 *                       type: string
 *               workExperience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jobTitle:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     duration:
 *                       type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     date:
 *                       type: string
 *     responses:
 *       200:
 *         description: رزومه با موفقیت ذخیره شد
 *       201:
 *         description: رزومه جدید ایجاد شد
 *       400:
 *         description: خطا در اطلاعات ارسالی
 *       403:
 *         description: محدودیت ویرایش (۳ بار) یا عدم دسترسی
 *       404:
 *         description: رزومه یافت نشد
 */
router.post("/data", ResumeCtrl.saveResumeData);

/**
 * @swagger
 * /api/resume/data/{id}:
 *   get:
 *     summary: دریافت اطلاعات متنی رزومه
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: اطلاعات رزومه
 *       401:
 *         description: احراز هویت نشده
 *       404:
 *         description: رزومه یافت نشد
 */
router.get("/data/:id", ResumeCtrl.getResumeData);

/**
 * @swagger
 * /api/resume/upload/{resumeId}:
 *   post:
 *     summary: آپلود فایل PDF رزومه
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resumeFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: فایل با موفقیت آپلود شد
 *       400:
 *         description: فایل ارسال نشده یا فرمت نامعتبر
 *       401:
 *         description: احراز هویت نشده
 *       404:
 *         description: رزومه یافت نشد
 */
router.post(
  "/upload/:resumeId",
  upload.single("resumeFile"),
  ResumeCtrl.uploadResumeFile,
);

/**
 * @swagger
 * /api/resume/preview/{id}:
 *   get:
 *     summary: دریافت لینک فایل رزومه
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: لینک فایل
 *       401:
 *         description: احراز هویت نشده
 *       404:
 *         description: فایلی یافت نشد
 */
router.get("/preview/:id", ResumeCtrl.getResumeUrl);

// ====== مسیرهای اضافی (اختیاری) ======

/**
 * @swagger
 * /api/resume/my:
 *   get:
 *     summary: دریافت لیست رزومه‌های کاربر جاری
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: لیست رزومه‌ها
 *       401:
 *         description: احراز هویت نشده
 */
router.get("/my", ResumeCtrl.getMyResumes);

/**
 * @swagger
 * /api/resume/admin/users-with-resumes:
 *   get:
 *     summary: دریافت کاربران دارای رزومه (فقط ادمین)
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: لیست کاربران و رزومه‌هایشان
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 */
router.get("/admin/users-with-resumes", ResumeCtrl.getUsersWithResumes);

export default router;
