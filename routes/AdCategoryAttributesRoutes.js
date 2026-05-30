const express = require("express");
const router = express.Router();

const {
  getAttributesByCategory,
  getAllCategoryAttributes,
} = require("../controllers/AdCategoryAttributesCtrl");

/**
 * GET all attributes
 */
router.get("/ad-category-attributes", getAllCategoryAttributes);

/**
 * GET attributes by category NAME (FA)
 * مثال: /api/ad-category-attributes/آموزشی
 */
router.get("/ad-category-attributes/:categoryName", getAttributesByCategory);

module.exports = router;
