import { Router } from "express";
import VipCtrl from "../controllers/VipCtrl";
import { authenticateUser, authenticateAdmin } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/user/vip/apply:
 *   post:
 *     summary: اعمال کد VIP توسط کاربر
 *     tags: [VIP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.post("/user/vip/apply", authenticateUser, VipCtrl.apply);

// ========== ادمین ==========
/**
 * @swagger
 * /api/admin/vip-codes/generate:
 *   post:
 *     summary: تولید کدهای VIP جدید
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, count, vipDuration]
 *             properties:
 *               title:
 *                 type: string
 *               count:
 *                 type: integer
 *               maxUses:
 *                type: integer
 *               vipDuration:
 *                 type: integer
 *               isPublic:
 *                 type: boolean
 *               targetUserId:
 *                 type: string
 *     responses:
 *       201:
 *         description: موفق
 */
router.post("/admin/vip-codes/generate", VipCtrl.generate);
// router.post("/admin/vip-codes/generate", authenticateAdmin, VipCtrl.generate);

/**
 * @swagger
 * /api/admin/vip-codes/{id}/activate:
 *   put:
 *     summary: فعال‌سازی یک کد VIP
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.put("/admin/vip-codes/:id/activate", VipCtrl.activate);
// router.put("/admin/vip-codes/:id/activate", authenticateAdmin, VipCtrl.activate);

/**
 * @swagger
 * /api/admin/vip-codes/{id}/deactivate:
 *   put:
 *     summary: غیرفعال کردن یک کد VIP
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.put("/admin/vip-codes/:id/deactivate", VipCtrl.deactivate);
// router.put("/admin/vip-codes/:id/deactivate", authenticateAdmin, VipCtrl.deactivate);

/**
 * @swagger
 * /api/admin/vip-codes:
 *   get:
 *     summary: دریافت لیست کدها با فیلتر (فعال/غیرفعال/همه)
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get("/admin/vip-codes", VipCtrl.list);
// router.get("/admin/vip-codes", authenticateAdmin, VipCtrl.list);

/**
 * @swagger
 * /api/admin/vip-codes/{id}:
 *   delete:
 *     summary: حذف کامل یک کد VIP و تاریخچه استفاده‌های آن
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.delete("/admin/vip-codes/:id", VipCtrl.delete);
// router.delete("/admin/vip-codes/:id", authenticateAdmin, VipCtrl.delete);

/**
 * @swagger
 * /api/admin/vip/revoke/{userId}:
 *   put:
 *     summary: لغو VIP یک کاربر خاص
 *     tags: [VIP-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.put("/admin/vip/revoke/:userId", VipCtrl.revokeUserVip);
// router.put("/admin/vip/revoke/:userId", authenticateAdmin, VipCtrl.revokeUserVip);

export default router;