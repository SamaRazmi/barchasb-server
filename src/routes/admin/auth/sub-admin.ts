import { Router } from "express";
import { AdminPending, AdminRegister, AdminActivate, AdminReject, ActiveAdmins } from "../../../controllers/admin/auth/sub-admin";

const router = Router();

/**
 * @swagger
 * /auth/sub-admin/register:
 *   post:
 *     summary: Register a new sub-admin
 *     description: Registers a new sub-admin. Validates password match, checks for existing phone numbers, and hashes the password.
 *     tags: [Yasrebi Backend]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *               - password
 *               - passwordConfirm
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: "Ali"
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: "Yasrebi"
 *               phone:
 *                 type: string
 *                 pattern: "^09\\d{9}$"
 *                 description: Iranian phone number format
 *                 example: "09123456789"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, and a number
 *                 example: "SecurePass123"
 *               passwordConfirm:
 *                 type: string
 *                 description: Must exactly match the password field
 *                 example: "SecurePass123"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin registered"
 *                 superAdminId:
 *                   type: string
 *                   example: "clxyz123456789"
 *       400:
 *         description: Bad Request (Missing fields, passwords mismatch, or phone already exists)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error: { type: string, example: "Bad Request" }
 *                     statusCode: { type: integer, example: 400 }
 *                 - type: object
 *                   properties:
 *                     message: { type: array, items: { type: string }, example: ["Passwords do not match"] }
 *                     error: { type: string, example: "Bad Request" }
 *                     statusCode: { type: integer, example: 400 }
 *                 - type: object
 *                   properties:
 *                     message: { type: string, example: "Phone already exists" }
 *                     error: { type: string, example: "Bad Request" }
 *                     statusCode: { type: integer, example: 400 }
 */
router.post('/sub-admin/register', AdminRegister);

/**
 * @swagger
 * /auth/sub-admin/pending:
 *   get:
 *     summary: Get pending admins
 *     description: Retrieves a list of admins. Only accessible by Super Admin.
 *     tags: [Yasrebi Backend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   role: { type: string, example: "admin" }
 *                   firstname: { type: string }
 *                   lastname: { type: string }
 *                   phone: { type: string }
 *                   verified: { type: boolean }
 *                   createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized (No token provided)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "دسترسی غیرمجاز: توکن ارسال نشده است." }
 *       403:
 *         description: Forbidden (Invalid token or not Super Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Only Super Admin can perform this action" }
 *                 error: { type: string, example: "Forbidden" }
 *                 statusCode: { type: integer, example: 403 }
 */
router.get('/sub-admin/pending', AdminPending);

/**
 * @swagger
 * /auth/sub-admin/approve/{id}:
 *   post:
 *     summary: Approve a sub-admin
 *     description: Activates/verifies a pending sub-admin. Only accessible by Super Admin.
 *     tags: [Yasrebi Backend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to approve
 *     responses:
 *       200:
 *         description: Admin approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 role: { type: string }
 *                 firstname: { type: string }
 *                 lastname: { type: string }
 *                 phone: { type: string }
 *                 verified: { type: boolean }
 *                 createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "دسترسی غیرمجاز: توکن ارسال نشده است." }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Only Super Admin can perform this action" }
 *                 error: { type: string, example: "Forbidden" }
 *                 statusCode: { type: integer, example: 403 }
 */
router.post('/sub-admin/approve/:id', AdminActivate);

/**
 * @swagger
 * /auth/sub-admin/reject/{id}:
 *   get:
 *     summary: Reject a sub-admin
 *     description: Rejects and deletes a pending sub-admin from the database. Only accessible by Super Admin.
 *     tags: [Yasrebi Backend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to reject
 *     responses:
 *       200:
 *         description: Admin rejected and deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 role: { type: string }
 *                 firstname: { type: string }
 *                 lastname: { type: string }
 *                 phone: { type: string }
 *                 verified: { type: boolean }
 *                 createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "دسترسی غیرمجاز: توکن ارسال نشده است." }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Only Super Admin can perform this action" }
 *                 error: { type: string, example: "Forbidden" }
 *                 statusCode: { type: integer, example: 403 }
 */
router.get('/sub-admin/reject/:id', AdminReject);

/**
 * @swagger
 * /auth/sub-admins/active:
 *   get:
 *     summary: Get active sub-admins
 *     description: Retrieves a list of all verified/active sub-admins. Only accessible by Super Admin.
 *     tags: [Yasrebi Backend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   role: { type: string }
 *                   firstname: { type: string }
 *                   lastname: { type: string }
 *                   phone: { type: string }
 *                   verified: { type: boolean }
 *                   createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "دسترسی غیرمجاز: توکن ارسال نشده است." }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Only Super Admin can perform this action" }
 *                 error: { type: string, example: "Forbidden" }
 *                 statusCode: { type: integer, example: 403 }
 */
router.get('/sub-admins/active', ActiveAdmins);

export default router;