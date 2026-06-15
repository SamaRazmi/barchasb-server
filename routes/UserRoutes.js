const express = require("express");
const router = express.Router();

const UsersCtrl = require("../controllers/UsersCtrl");
const RegisterCtrl = require("../controllers/RegisterCtrl");
const LoginCtrl = require("../controllers/LoginCtrl");
const AuthCtrl = require("../controllers/AuthCtrl");
const { authenticateToken } = require("../middleware/authMidleware");
const LogoutCtrl = require("../controllers/LogoutCtrl");
const ForgotPasswordCtrl = require("../controllers/ForgotPasswordCtrl");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: مدیریت کاربران
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: دریافت همه کاربران
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: لیست کاربران
 *       401:
 *         description: توکن معتبر نیست
 */
router.get("/users", authenticateToken, UsersCtrl.getAllUsers);

/**
 * @swagger
 * /api/get-one-user/{id}:
 *   get:
 *     summary: دریافت یک کاربر
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: شناسه کاربر
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: اطلاعات کاربر
 *       401:
 *         description: توکن معتبر نیست
 *       404:
 *         description: کاربر پیدا نشد
 */
router.get("/get-one-user/:id", authenticateToken, UsersCtrl.getOneUser);

/**
 * @swagger
 * /api/new-user:
 *   post:
 *     summary: ایجاد کاربر جدید
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: کاربر ایجاد شد
 *       400:
 *         description: خطا در ایجاد کاربر
 */
router.post("/new-user", UsersCtrl.createUser);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: احراز هویت
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: دریافت اطلاعات کاربر لاگین شده
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات کاربر
 *       401:
 *         description: توکن معتبر نیست
 */
router.get("/auth/me", authenticateToken, AuthCtrl.getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: خروج از حساب کاربری
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: خروج موفق
 *       401:
 *         description: توکن معتبر نیست
 */
router.post("/auth/logout", authenticateToken, LogoutCtrl.logoutUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: ثبت‌نام کاربر جدید
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: ثبت‌نام موفق
 *       400:
 *         description: خطا در ثبت‌نام
 */
router.post("/auth/register", RegisterCtrl.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: ورود کاربر
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: ورود موفق، کوکی و Bearer Token
 *       400:
 *         description: شماره یا رمز اشتباه
 *       500:
 *         description: خطا در سرور
 */
router.post("/auth/login", LoginCtrl.loginUser);

// ------------------- ارسال کد ثبت‌نام -------------------

/**
 * @swagger
 * /api/send-register-email:
 *   post:
 *     summary: ارسال کد ثبت‌نام به ایمیل
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: کد ارسال شد
 *       400:
 *         description: خطا
 */
router.post("/send-register-email", UsersCtrl.sendRegisterEmail);

/**
 * @swagger
 * /api/send-register-phone:
 *   post:
 *     summary: ارسال کد ثبت‌نام به تلفن
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: کد ارسال شد
 *       400:
 *         description: خطا
 */
router.post("/send-register-phone", UsersCtrl.sendRegisterPhone);

// ------------------- تایید شماره تلفن -------------------

/**
 * @swagger
 * /api/verify-phone:
 *   post:
 *     summary: تایید شماره تلفن
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: شماره تایید شد
 *       400:
 *         description: اطلاعات ناقص
 */
router.post("/verify-phone", UsersCtrl.verifyUserPhone);

// ------------------- تایید ایمیل -------------------

/**
 * @swagger
 * /api/send-verify-email/{id}:
 *   post:
 *     summary: ارسال کد تایید ایمیل
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: کد ارسال شد
 *       400:
 *         description: خطا
 */
router.post("/send-verify-email/:id", UsersCtrl.sendVerifyEmail);

/**
 * @swagger
 * /api/verify-email-code/{id}:
 *   post:
 *     summary: تایید ایمیل با کد ۶ رقمی
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: ایمیل تایید شد
 *       400:
 *         description: کد اشتباه یا منقضی شده
 */
router.post("/verify-email-code/:id", UsersCtrl.verifyEmailByCode);

/**
 * @swagger
 * /api/verify-email/{token}:
 *   get:
 *     summary: تایید ایمیل با لینک (قدیمی)
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ایمیل تایید شد
 *       400:
 *         description: لینک نامعتبر
 */
router.get("/verify-email/:token", UsersCtrl.verifyEmail);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: تغییر رمز عبور (مرحله دوم فراموشی رمز)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *               - newPassword
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *                 example: "09123456789"
 *               code:
 *                 type: string
 *                 description: کد تایید دریافت شده از OTP
 *                 example: "12345"
 *               newPassword:
 *                 type: string
 *                 description: رمز عبور جدید (حداقل ۵ کاراکتر)
 *                 example: "newPass123"
 *     responses:
 *       200:
 *         description: رمز عبور با موفقیت تغییر کرد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "رمز عبور با موفقیت تغییر کرد"
 *       400:
 *         description: اطلاعات ناقص یا رمز ضعیف یا کد نامعتبر
 *       404:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.post("/auth/reset-password", ForgotPasswordCtrl.resetPassword);

module.exports = router;
