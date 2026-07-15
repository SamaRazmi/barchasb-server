// src/controllers/ProvinceCtrl.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";

// ====== تابع کمکی برای تبدیل پارامترهای Express به string ======
const toStr = (value: unknown): string => {
  if (Array.isArray(value)) return value[0] || "";
  if (typeof value === "string") return value;
  return "";
};

// ================================================================
// دریافت تمام استان‌ها
export const getAllProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await prisma.province.findMany();
    res.json(provinces);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ================================================================
// دریافت شهرهای یک استان خاص (بر اساس نام استان)
export const getCitiesByProvince = async (req: Request, res: Response) => {
  try {
    // 🔹 تبدیل req.params.province به string (رفع خطا)
    const provinceName = toStr(req.params.province);

    const province = await prisma.province.findFirst({
      where: { name: provinceName },
    });

    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    res.json(province.cities);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ================================================================
// دریافت تمام شهرهای موجود در تمام استان‌ها (بدون تکرار)
export const getAllCities = async (req: Request, res: Response) => {
  try {
    const provinces = await prisma.province.findMany();
    const allCities = provinces.reduce(
      (acc, province) => acc.concat(province.cities),
      [] as string[],
    );
    const uniqueCities = [...new Set(allCities)];
    res.json(uniqueCities);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// =================== export default ===================
const ProvinceCtrl = {
  getAllProvinces,
  getCitiesByProvince,
  getAllCities,
};

export default ProvinceCtrl;
