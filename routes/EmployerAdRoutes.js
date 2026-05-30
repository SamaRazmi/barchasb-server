const router = require("express").Router();
const { imagesUpload } = require("../middleware/upload");
const employerController = require("../controllers/EmployerAdCtrl");
const authenticateToken = require("../middleware/authMidleware");

/**
 * @swagger
 * tags:
 *   name: EmployerAds
 *   description: مدیریت آگهی‌های کارفرما
 */

/* ===================== CREATE (AUTH) ===================== */
/**
 * @swagger
 * /api/ads/employer:
 *   post:
 *     summary: ایجاد آگهی کارفرما
 *     tags: [EmployerAds]
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
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: آگهی ایجاد شد
 *       401:
 *         description: عدم احراز هویت
 */
router.post(
  "/ads/employer",
  authenticateToken,
  imagesUpload.array("images", 9),
  employerController.createEmployerAd,
);

/* ===================== GET BY OWNER ===================== */
/**
 * @swagger
 * /api/ads/employer/owner/{ownerId}:
 *   get:
 *     summary: دریافت همه آگهی‌های یک کاربر
 *     tags: [EmployerAds]
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
router.get("/ads/employer/owner/:ownerId", employerController.getAdsByOwner);

/* ===================== GET & UPDATE BY OWNER + AD ===================== */
/**
 * @swagger
 * /api/ads/employer/{ownerId}/{adId}:
 *   get:
 *     summary: دریافت یک آگهی مشخص از یک کاربر مشخص
 *     tags: [EmployerAds]
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
 *   put:
 *     summary: ویرایش آگهی
 *     tags: [EmployerAds]
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
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: ویرایش موفق
 *       401:
 *         description: عدم احراز هویت
 */
router
  .route("/ads/employer/:ownerId/:adId")
  .get(employerController.getEmployerAdByOwnerAndId)
  .put(
    authenticateToken,
    imagesUpload.array("images", 9),
    employerController.updateEmployerAd,
  );

/* ===================== GET ALL ===================== */
/**
 * @swagger
 * /api/ads/employer:
 *   get:
 *     summary: دریافت همه آگهی‌ها (عمومی)
 *     tags: [EmployerAds]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get("/ads/employer", employerController.getAllEmployerAds);

/* ===================== GET SINGLE ===================== */
/**
 * @swagger
 * /api/ads/employer/{id}:
 *   get:
 *     summary: دریافت آگهی با ID
 *     tags: [EmployerAds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: موفق
 *       404:
 *         description: یافت نشد
 */
router.get("/ads/employer/:id", employerController.getEmployerAdById);
/* =======================
   DELETE
======================= */
/**
 * @swagger
 * /api/ads/employer/{adId}:
 *   delete:
 *     summary: حذف آگهی کارفرما (فقط مالک)
 *     tags: [EmployerAds]
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
  "/ads/employer/:adId",
  authenticateToken,
  employerController.deleteEmployerAd,
);

module.exports = router;
