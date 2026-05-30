import AdCategory from "../models/AdCategory.js";

const AdCategoryCtrl = {
  // دریافت زیر دسته‌ها برای یک دسته اصلی
  getSubCategories: async (req, res) => {
    try {
      const mainCategoryId = req.params.id;

      // پیدا کردن دسته اصلی
      const mainCategory = await AdCategory.findById(mainCategoryId);
      if (!mainCategory) {
        return res
          .status(404)
          .json({ status: "error", message: "Category not found" });
      }

      // گرفتن زیر دسته‌ها
      const subCategories = await AdCategory.find({
        parent: mainCategoryId,
      }).lean();

      res.status(200).json({
        status: "success",
        category: {
          _id: mainCategory._id,
          name: mainCategory.name,
          subCategories: subCategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
          })),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // گرفتن همه دسته‌های اصلی (سر دسته‌ها)
  getMainCategories: async (req, res) => {
    try {
      const mainCategories = await AdCategory.find({ parent: null }).lean();
      res.status(200).json({
        status: "success",
        categories: mainCategories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default AdCategoryCtrl;
