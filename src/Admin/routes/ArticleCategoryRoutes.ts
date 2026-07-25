import { Router } from "express";
import CategoryCtrl from "../controllers/ArticleCategoryCtrl";
import { authenticateAdmin } from "../../middleware/authMidleware";

const router = Router();

router.use(authenticateAdmin);

/**
 * @swagger
 * /api/admin/article/categories:
 *   get:
 *     tags: [Admin-Article-Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             status:
 *                               type: string
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get("", CategoryCtrl.getAll);

/**
 * @swagger
 * /api/admin/article/categories:
 *   post:
 *     tags: [Admin-Article-Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام دسته‌بندی
 *                 example: "هوش مصنوعی و یادگیری ماشین"
 *               slug:
 *                 type: string
 *                 description: اسلاگ یکتا (برای URL)
 *                 example: "ai-ml"
 *     responses:
 *       201:
 *         description: ایجاد موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: خطای اعتبارسنجی (نام یا اسلاگ تکراری، فیلدهای缺失)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.post("", CategoryCtrl.create);

/**
 * @swagger
 * /api/admin/article/categories/{id}:
 *   put:
 *     tags: [Admin-Article-Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته‌بندی
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام جدید دسته‌بندی
 *               slug:
 *                 type: string
 *                 description: اسلاگ جدید (یکتا)
 *     responses:
 *       200:
 *         description: ویرایش موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: خطای اعتبارسنجی (اسلاگ تکراری)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: دسته‌بندی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.put("/:id", CategoryCtrl.update);

/**
 * @swagger
 * /api/admin/article/categories/{id}:
 *   delete:
 *     tags: [Admin-Article-Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه دسته‌بندی
 *     responses:
 *       200:
 *         description: حذف موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: دسته‌بندی با موفقیت حذف شد
 *       400:
 *         description: خطا (دسته‌بندی دارای مقاله است)
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: دسته‌بندی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.delete("/:id", CategoryCtrl.delete);

export default router;