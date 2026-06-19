// src/controllers/AdCategoryCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

// تابع کمکی برای تبدیل params به string
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const AdCategoryCtrl = {
  // دریافت زیر دسته‌ها برای یک دسته اصلی
  getSubCategories: async (req: Request, res: Response) => {
    try {
      const mainCategoryId = toStr(req.params.id);

      if (!mainCategoryId) {
        return res
          .status(400)
          .json({ status: "error", message: "شناسه دسته معتبر نیست" });
      }

      // پیدا کردن دسته اصلی
      const mainCategory = await prisma.adCategory.findUnique({
        where: { id: mainCategoryId },
      });
      if (!mainCategory) {
        return res
          .status(404)
          .json({ status: "error", message: "Category not found" });
      }

      // گرفتن زیر دسته‌ها
      const subCategories = await prisma.adCategory.findMany({
        where: { parent: mainCategoryId },
      });

      res.status(200).json({
        status: "success",
        category: {
          _id: mainCategory.id,
          name: mainCategory.name,
          subCategories: subCategories.map((sub) => ({
            _id: sub.id,
            name: sub.name,
          })),
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // گرفتن همه دسته‌های اصلی (سر دسته‌ها)
  getMainCategories: async (req: Request, res: Response) => {
    try {
      const mainCategories = await prisma.adCategory.findMany({
        where: { parent: null },
      });
      res.status(200).json({
        status: "success",
        categories: mainCategories.map((cat) => ({
          _id: cat.id,
          name: cat.name,
        })),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default AdCategoryCtrl;
