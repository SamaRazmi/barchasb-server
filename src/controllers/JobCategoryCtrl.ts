import { Request, Response } from "express";
import prisma from "../config/prisma";

// ==========================================
// 📌 کنترلر مدیریت دسته‌های شغلی با Prisma
// ==========================================

const JobCategoryCtrl = {
  /**
   * دریافت همه دسته‌های اصلی (parent = null)
   */
  getMainCategories: async (req: Request, res: Response) => {
    try {
      const mainCats = await prisma.jobCategory.findMany({
        where: { parent: null },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });

      res.status(200).json({
        status: "success",
        categories: mainCats.map((cat) => ({
          _id: cat.id,
          name: cat.name,
        })),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  /**
   * دریافت زیردسته‌های یک دسته خاص (بر اساس parentId)
   */
  getSubCategories: async (req: Request, res: Response) => {
    try {
      const { parentId } = req.query;
      if (!parentId || typeof parentId !== "string") {
        return res
          .status(400)
          .json({ status: "error", message: "parentId required" });
      }

      const subCats = await prisma.jobCategory.findMany({
        where: { parent: parentId as string },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });

      res.status(200).json({
        status: "success",
        categories: subCats.map((cat) => ({
          _id: cat.id,
          name: cat.name,
        })),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  /**
   * جستجو فقط در زیردسته‌ها (دسته‌هایی که parent !== null)
   * ✅ اصلاح شده: اضافه کردن parentId در خروجی
   */
  searchSubCategories: async (req: Request, res: Response) => {
    try {
      const { keyword } = req.query;
      if (!keyword || typeof keyword !== "string") {
        return res
          .status(400)
          .json({ status: "error", message: "Keyword required" });
      }

      const subCategories = await prisma.jobCategory.findMany({
        where: {
          name: {
            contains: keyword as string,
            mode: "insensitive",
          },
          parent: { not: null },
        },
        select: {
          id: true,
          name: true,
          parent: true,
        },
        orderBy: { name: "asc" },
      });

      res.status(200).json({
        status: "success",
        categories: subCategories.map((cat) => ({
          _id: cat.id,
          name: cat.name,
          parentId: cat.parent,
        })),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  /**
   * دریافت یک دسته بر اساس id (برای استفاده در فرانت‌اند)
   * ✅ اضافه شد تا درخواست fetchCategoryById در فرانت‌اند پاسخ داده شود
   */
  getCategoryById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        return res
          .status(400)
          .json({ status: "error", message: "id required" });
      }

      const category = await prisma.jobCategory.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          parent: true,
        },
      });

      if (!category) {
        return res
          .status(404)
          .json({ status: "error", message: "Category not found" });
      }

      res.status(200).json({
        status: "success",
        category: {
          _id: category.id,
          name: category.name,
          parentId: category.parent,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  /**
   * دریافت همه زیردسته‌ها (مهارت‌ها) بدون نیاز به parentId
   */
  getAllSubCategories: async (req: Request, res: Response) => {
    try {
      const allSubs = await prisma.jobCategory.findMany({
        where: { parent: { not: null } },
        select: {
          id: true,
          name: true,
          parent: true,
        },
        orderBy: { name: "asc" },
      });

      res.status(200).json({
        status: "success",
        categories: allSubs.map((cat) => ({
          _id: cat.id,
          name: cat.name,
          parent: cat.parent,
        })),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  /**
   * دریافت آگهی‌های شغلی بر اساس دسته اصلی (فیلتر سمت سرور)
   * ⚠️ placeholder
   */
  getJobsByMainCategory: async (req: Request, res: Response) => {
    try {
      const { mainId } = req.params;
      if (!mainId || typeof mainId !== "string") {
        return res
          .status(400)
          .json({ status: "error", message: "mainId required" });
      }

      const subCategories = await prisma.jobCategory.findMany({
        where: { parent: mainId as string },
        select: { id: true },
      });
      const subCategoryIds = subCategories.map((sub) => sub.id);

      if (subCategoryIds.length === 0) {
        return res.status(200).json({ status: "success", jobs: [] });
      }

      const jobs: any[] = [];
      res.status(200).json({
        status: "success",
        jobs: jobs,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default JobCategoryCtrl;
