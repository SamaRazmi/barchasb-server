import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

const TechnicalCatData = async () => {
  try {
    const data: Prisma.TestCategoryUncheckedCreateInput = {
      name: "مهارتی و تخصصی",
      description:
        "آزمون‌های سنجش میزان تسلط بر ابزارها و مهارت‌های فنی و نرم‌افزاری",
      isActive: true,
    };

    const category = await prisma.testCategory.upsert({
      where: { name: "مهارتی و تخصصی" },
      update: data,
      create: data,
    });

    console.log("-----------------------------------------");
    console.log("Technical/Skill category inserted/updated.");
    console.log(`ID: ${category.id}`);
    console.log("-----------------------------------------");

    return category;
  } catch (error) {
    console.error("Error inserting technical category:", error);
    throw error;
  }
};

export default TechnicalCatData;
