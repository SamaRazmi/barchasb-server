import { Router } from "express";
import ArticleCtrl from "../controllers/ArticleManagementCtrl";
import { authenticateAdmin } from "../../middleware/authMidleware";
import { imagesUpload } from "../../middleware/upload";

const router = Router();

router.use(authenticateAdmin);

/**
 * @swagger
 * /api/admin/articles:
 *   get:
 *     tags: [Admin-Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *       200: { description: موفق }
 */
router.get("", ArticleCtrl.list);

/**
 * @swagger
 * /api/admin/articles/{id}:
 *   get:
 *     tags: [Admin-Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: موفق }
 */
router.get("/:id", ArticleCtrl.getOne);

/**
 * @swagger
 * /api/admin/articles:
 *   post:
 *     tags: [Admin-Articles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, slug, categoryId, content]
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *                 description: JSON string of Delta
 *               plaintext:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       201: { description: موفق }
 */
router.post(
  "",
  imagesUpload.single("featuredImage"),
  ArticleCtrl.create
);

/**
 * @swagger
 * /api/admin/articles/{id}:
 *   put:
 *     tags: [Admin-Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *                 description: JSON string of Delta
 *               plaintext:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200: { description: موفق }
 */
router.put(
  "/:id",
  imagesUpload.single("featuredImage"),
  ArticleCtrl.update
);

/**
 * @swagger
 * /api/admin/articles/{id}:
 *   delete:
 *     tags: [Admin-Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: موفق }
 */
router.delete("/:id", ArticleCtrl.delete);

export default router;