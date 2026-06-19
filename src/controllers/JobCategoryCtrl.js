const JobCategory = require("../models/JobCategory");

const JobCategoryCtrl = {
  // 1. دریافت همه دسته‌های اصلی (parent = null)
  getMainCategories: async (req, res) => {
    try {
      const mainCats = await JobCategory.find({ parent: null }).lean();
      res.status(200).json({
        status: "success",
        categories: mainCats.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 2. دریافت زیردسته‌های یک دسته خاص (بر اساس parentId)
  getSubCategories: async (req, res) => {
    try {
      const { parentId } = req.query;
      if (!parentId) {
        return res
          .status(400)
          .json({ status: "error", message: "parentId required" });
      }
      const subCats = await JobCategory.find({ parent: parentId }).lean();
      res.status(200).json({
        status: "success",
        categories: subCats.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 3. جستجو فقط در زیردسته‌ها (دسته‌هایی که parent !== null)
  searchSubCategories: async (req, res) => {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res
          .status(400)
          .json({ status: "error", message: "Keyword required" });
      }
      const regex = new RegExp(keyword.trim().replace(/\s+/g, ".*?"), "i");
      const subCategories = await JobCategory.find({
        name: regex,
        parent: { $ne: null },
      }).lean();
      res.status(200).json({
        status: "success",
        categories: subCategories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 4. (جدید) دریافت همه زیردسته‌ها (مهارت‌ها) بدون نیاز به parentId
  getAllSubCategories: async (req, res) => {
    try {
      const allSubs = await JobCategory.find({ parent: { $ne: null } }).lean();
      res.status(200).json({
        status: "success",
        categories: allSubs.map((cat) => ({
          _id: cat._id,
          name: cat.name,
          parent: cat.parent,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // 5. (جدید) دریافت آگهی‌های شغلی بر اساس دسته اصلی (فیلتر هوشمند در بک‌اند)
  getJobsByMainCategory: async (req, res) => {
    try {
      const { mainId } = req.params;
      if (!mainId) {
        return res
          .status(400)
          .json({ status: "error", message: "mainId required" });
      }

      // 1. پیدا کردن همه زیردسته‌های مربوط به این دسته اصلی
      const subCategories = await JobCategory.find({ parent: mainId })
        .select("_id")
        .lean();
      const subCategoryIds = subCategories.map((sub) => sub._id);

      if (subCategoryIds.length === 0) {
        // اگر زیردسته‌ای وجود نداشت، آرایه خالی برگردان
        return res.status(200).json({ status: "success", jobs: [] });
      }

      // 2. جستجوی آگهی‌هایی که زیردسته‌شان (subCategory) در این لیست باشد
      //    فرض می‌کنیم مدل Job دارای فیلد subCategory (از نوع ObjectId) است.
      //    اگر آگهی می‌تواند چندین مهارت داشته باشد (مثلاً skills)، از $in استفاده کنید.
      const jobs = await Job.find({ subCategory: { $in: subCategoryIds } })
        .populate("subCategory") // برای نمایش اطلاعات زیردسته در خروجی
        .lean();

      res.status(200).json({
        status: "success",
        jobs: jobs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

module.exports = JobCategoryCtrl;
