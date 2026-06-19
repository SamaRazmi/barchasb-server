import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await prisma.province.findMany({});
    res.json(provinces);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCitiesByProvince = async (req: Request, res: Response) => {
  try {
    const province = await prisma.province.findFirst({
      where: { name: req.params.province },
    });
    if (!province)
      return res.status(404).json({ message: "Province not found" });
    res.json(province.cities);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const provinces = await prisma.province.findMany({});
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
