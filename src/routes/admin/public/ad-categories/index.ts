import { Router } from "express";
import { AdCategoriesDescendants, AdCategoriesTree } from "../../../../controllers/admin/public/ad-categories";

const router = Router()

router.get('/tree', AdCategoriesTree)

router.get('/:id/descendants', AdCategoriesDescendants)


export default router