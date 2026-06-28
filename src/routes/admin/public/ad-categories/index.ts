import { Router } from "express";
import { AdCategoriesDescendants, AdCategoriesTree } from "../../../../controllers/admin/public/ad-categories";

const router = Router()

/**
 * @swagger
 * /public/ad-categories/tree:
 *   get:
 *     summary: Get all ad categories
 *     description: Retrieves a list of all ad categories. Maps the database 'id' to '_id' and initializes an empty 'children' array for each item.
 *     tags: [Yasrebi Backend]
 *     security: []
 *     responses:
 *       200:
 *         description: A list of ad categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The category ID (mapped from the original 'id')
 *                     example: "clxyz123456789"
 *                   children:
 *                     type: array
 *                     items: {}
 *                     description: An empty array (intended for frontend tree building)
 *                     example: []
 *                   # Note: Add any other fields from your AdCategory model here (e.g., name, parentId, etc.)
 *                   name:
 *                     type: string
 *                     example: "Vehicles"
 */
router.get('/tree', AdCategoriesTree)

/**
 * @swagger
 * /public/ad-categories/descendants/{id}:
 *   get:
 *     summary: Get a specific ad category by ID
 *     description: Retrieves the details of a specific ad category using its unique ID.
 *     tags: [Yasrebi Backend]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the ad category
 *         example: "clxyz123456789"
 *     responses:
 *       200:
 *         description: The ad category details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clxyz123456789"
 *                 # Note: Add any other fields from your AdCategory model here
 *                 name:
 *                   type: string
 *                   example: "Vehicles"
 *       400:
 *         description: Bad Request - ID parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Id are required"
 *       404:
 *         description: Not Found - Ad category does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "دسته بندی با این مشخصات پیدا نشد"
 */
router.get('/:id/descendants', AdCategoriesDescendants)


export default router