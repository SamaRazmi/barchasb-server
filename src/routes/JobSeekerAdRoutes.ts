// src/routes/JobSeekerAdRoutes.ts
import express from "express";
import { imagesUpload, fileUpload } from "../middleware/upload";
import JobSeekerAdCtrl from "../controllers/JobSeekerAdCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobSeekerAds
 *   description: مدیریت آگهی‌های جوینده کار
 */

/* =======================
   CREATE
======================= */
/**
 * @swagger
 * /api/ads/jobseeker:
 *   post:
 *     summary: ایجاد آگهی جوینده کار
 *     tags: [JobSeekerAds]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               name:
 *                 type: string
 *               age:
 *                 type: string
 *               gender:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               suggestedSalaryIRT:
 *                 type: string
 *               aboutMe:
 *                 type: string
 *     responses:
 *       201:
 *         description: آگهی با موفقیت ایجاد شد
 *       400:
 *         description: درخواست نامعتبر
 *       401:
 *         description: عدم احراز هویت
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/ads/jobseeker",
  authenticateToken,
  (req, res, next) => {
    if (req.is("application/json")) return next();
    imagesUpload.fields([{ name: "images", maxCount: 9 }])(req, res, next);
  },
  JobSeekerAdCtrl.createJobSeekerAd,
);

/* =======================
   UPLOAD FILES
======================= */
/**
 * @swagger
 * /api/ads/jobseeker/{id}/resume:
 *   post:
 *     summary: آپلود رزومه برای آگهی
 *     tags: [JobSeekerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *         description: رزومه آپلود شد
 *       401:
 *         description: عدم احراز هویت
 *       404:
 *         description: آگهی یافت نشد
 */
router.post(
  "/ads/jobseeker/:id/resume",
  authenticateToken,
  fileUpload.single("resumeFile"),
  JobSeekerAdCtrl.uploadResume,
);

/**
 * @swagger
 * /api/ads/jobseeker/{id}/work-sample:
 *   post:
 *     summary: آپلود نمونه‌کار برای آگهی
 *     tags: [JobSeekerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               workSampleFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: نمونه‌کار آپلود شد
 *       401:
 *         description: عدم احراز هویت
 *       404:
 *         description: آگهی یافت نشد
 */
router.post(
  "/ads/jobseeker/:id/work-sample",
  authenticateToken,
  fileUpload.single("workSampleFile"),
  JobSeekerAdCtrl.uploadWorkSample,
);

/* =======================
   GET
======================= */
/**
 * @swagger
 * /api/ads/jobseeker/owner/{ownerId}:
 *   get:
 *     summary: دریافت آگهی‌های یک کاربر خاص
 *     tags: [JobSeekerAds]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.get("/ads/jobseeker/owner/:ownerId", JobSeekerAdCtrl.getAdsByOwner);

/**
 * @swagger
 * /api/ads/jobseeker/{ownerId}/{adId}:
 *   get:
 *     summary: دریافت یک آگهی مشخص از یک کاربر مشخص
 *     tags: [JobSeekerAds]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *       - name: adId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: موفق
 *       404:
 *         description: آگهی یافت نشد
 */
router.get(
  "/ads/jobseeker/:ownerId/:adId",
  JobSeekerAdCtrl.getJobSeekerAdByOwnerAndId,
);

/**
 * @swagger
 * /api/ads/jobseeker:
 *   get:
 *     summary: دریافت همه آگهی‌ها
 *     tags: [JobSeekerAds]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get("/ads/jobseeker", JobSeekerAdCtrl.getAllJobSeekerAds);

/**
 * @swagger
 * /api/ads/jobseeker/{id}:
 *   get:
 *     summary: دریافت آگهی تکی
 *     tags: [JobSeekerAds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 *       404:
 *         description: آگهی یافت نشد
 */
router.get("/ads/jobseeker/:id", JobSeekerAdCtrl.getJobSeekerAdById);

/* =======================
   UPDATE
======================= */
/**
 * @swagger
 * /api/ads/jobseeker/{ownerId}/{adId}:
 *   put:
 *     summary: ویرایش آگهی جوینده کار
 *     tags: [JobSeekerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *       - name: adId
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: آگهی ویرایش شد
 *       401:
 *         description: عدم احراز هویت
 *       404:
 *         description: آگهی یافت نشد
 */
router.put(
  "/ads/jobseeker/:ownerId/:adId",
  authenticateToken,
  imagesUpload.array("images", 9),
  JobSeekerAdCtrl.updateJobSeekerAd,
);

/* =======================
   DELETE
======================= */
/**
 * @swagger
 * /api/ads/jobseeker/{adId}:
 *   delete:
 *     summary: حذف آگهی جوینده کار (فقط مالک)
 *     tags: [JobSeekerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: آگهی با موفقیت حذف شد
 *       401:
 *         description: توکن معتبر نیست
 *       404:
 *         description: آگهی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.delete(
  "/ads/jobseeker/:adId",
  authenticateToken,
  JobSeekerAdCtrl.deleteJobSeekerAd,
);

export default router;
