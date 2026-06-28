import { Router } from "express";
import { SuperAdminRegister } from "../../../controllers/admin/auth/super-admin";

const router = Router();

/**
 * @swagger
 * /auth/super-admin/register:
 *   post:
 *     summary: Register a new super admin
 *     description: Registers a new super admin. Validates password match, checks for existing phone numbers, and hashes the password.
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
 *                 format: password
 *                 description: Must contain uppercase, lowercase, and a number
 *                 example: "SecurePass123"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 description: Must exactly match the password field
 *                 example: "SecurePass123"
 *     responses:
 *       201:
 *         description: Super Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Super Admin registered"
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
router.post('/super-admin/register', SuperAdminRegister);

export default router;