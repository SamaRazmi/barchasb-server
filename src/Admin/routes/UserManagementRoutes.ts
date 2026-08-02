import { Router } from "express";
import UserManagementCtrl from "../controllers/UserManagementCtrl";
import { authenticateAdmin } from "../../middleware/authMidleware";

const router = Router();

router.use(authenticateAdmin);

/**
 * @swagger
 * /api/admin/users/stats:
 *   get:
 *     tags: [Admin-Users]
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
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     onlineUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     inactiveUsers:
 *                       type: integer
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get("/stats", UserManagementCtrl.stats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin-Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: جستجو در نام، نام خانوادگی، نام کاربری، تلفن و کد ملی
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           username:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           nationalCode:
 *                             type: string
 *                           province:
 *                             type: string
 *                           city:
 *                             type: string
 *                           online:
 *                             type: boolean
 *                           profileImage:
 *                             type: string
 *                             nullable: true
 *                           platforms:
 *                             type: array
 *                             items:
 *                               type: string
 *                           adCount:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get("", UserManagementCtrl.list);

/** 
 * @swagger
 * /api/admin/users/{id}/profile:
 *   get:
 *     tags: [Admin-Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: userId
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nationalCode:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     province:
 *                       type: string
 *                     city:
 *                       type: string
 *                     birthDate:
 *                       type: string
 *                     educationLevel:
 *                       type: string
 *                       nullable: true
 *                     address:
 *                       type: string
 *                       nullable: true
 *                     aboutMe:
 *                       type: string
 *                       nullable: true
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     resumeFile:
 *                       type: string
 *                       nullable: true
 *                     portfolioFiles:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/:id/profile", UserManagementCtrl.profile);

/**
 * @swagger
 * /api/admin/users/{id}/ads:
 *   get:
 *     tags: [Admin-Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: userId
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
 *                       title:
 *                         type: string
 *                       category:
 *                         type: string
 *                       description:
 *                         type: string
 *                       province:
 *                         type: string
 *                       status:
 *                         type: string
 *                       application:
 *                         type: string
 *                       adType:
 *                         type: string
 *                       person:
 *                         type: string
 *                       adStatus:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/:id/ads", UserManagementCtrl.ads);

/**
 * @swagger
 * /api/admin/users/{id}/financial:
 *   get:
 *     tags: [Admin-Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserId
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
 *                   type: object
 *                   properties:
 *                     wallet:
 *                       type: object
 *                       properties:
 *                         balance:
 *                           type: string
 *                         heldBalance:
 *                           type: string
 *                         availableBalance:
 *                           type: string
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           date:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           type:
 *                             type: string
 *                           status:
 *                             type: string
 *                           isSuccessful:
 *                             type: boolean
 *                           paymentMethod:
 *                             type: string
 *                           referenceId:
 *                             type: string
 *                             nullable: true
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: کاربر یا کیف پول یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/:id/financial", UserManagementCtrl.financial);

/**
 * @swagger
 * /api/admin/users/{id}/sessions:
 *   get:
 *     tags: [Admin-Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserID
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
 *                       deviceName:
 *                         type: string
 *                       ip:
 *                         type: string
 *                       browser:
 *                         type: string
 *                       os:
 *                         type: string
 *                       deviceType:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       lastActiveAt:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       404:
 *         description: کاربر یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/:id/sessions", UserManagementCtrl.sessions);

export default router;