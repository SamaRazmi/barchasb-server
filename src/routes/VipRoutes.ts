import { Router } from "express";
import VipCtrl from "../controllers/VipCtrl";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/user/vip/apply:
 *   post:
 *     summary: اعمال کد VIP توسط کاربر
 *     tags: [VIP]
 *     security:
 *       - BearerAuth: []
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
 *       200: { description: موفق }
 */
router.post("/user/vip/apply", authenticateUser, VipCtrl.apply);

export default router;