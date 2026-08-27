import { Request, Response } from "express";
import { ArticlesService } from "../services/ArticlesService";

const ArticlesCtrl = {
  /**
   * دریافت دسته‌بندی‌ها
   * GET /api/categories
   */
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await ArticlesService.getCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت دسته‌بندی‌ها",
      });
    }
  },

  /**
   * دریافت خلاصه مقالات (عمومی)
   * GET /api/public/articles/summary
   */
  getArticlesSummary: async (req: Request, res: Response) => {
    try {
      const summaries = await ArticlesService.getArticlesSummary();
      res.status(200).json(summaries);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت خلاصه مقالات",
      });
    }
  },

  /**
   * دریافت مقالات کامل بر اساس دسته‌بندی
   * GET /api/articles/by-category?category=<categoryId>
   */
  getArticlesByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      if (!category || typeof category !== "string") {
        return res.status(400).json({
          status: "error",
          message: "شناسه دسته الزامی است",
        });
      }

      const articles = await ArticlesService.getArticlesByCategory(category);
      res.status(200).json(articles);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت مقالات دسته",
      });
    }
  },
};

export default ArticlesCtrl;