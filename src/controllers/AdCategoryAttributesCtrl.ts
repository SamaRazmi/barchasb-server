import { Request, Response } from "express";
import additionalAdCategoriesData from "../data/adAdditionalAttributes";

/**
 * GET attributes by category NAME (FROM STATIC DATA)
 * مثال: /api/ad-category-attributes/آموزشی
 */
export const getAttributesByCategory = (req: Request, res: Response) => {
  try {
    const categoryName = req.params.categoryName;

    const category = additionalAdCategoriesData.find(
      (item) => item.name === categoryName,
    );

    if (!category) {
      return res.status(404).json({
        message: "ویژگی‌ای برای این دسته ثبت نشده",
      });
    }

    res.status(200).json({
      categoryName: category.name,
      parent: category.parent,
      fields: category.fields,
    });
  } catch (error) {
    res.status(500).json({ message: "خطای سرور" });
  }
};

/**
 * GET all category attributes
 */
export const getAllCategoryAttributes = (req: Request, res: Response) => {
  try {
    res.status(200).json(additionalAdCategoriesData);
  } catch {
    res.status(500).json({ message: "خطای سرور" });
  }
};

// =================== export default ===================
const AdCategoryAttributesCtrl = {
  getAttributesByCategory,
  getAllCategoryAttributes,
};

export default AdCategoryAttributesCtrl;
