import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

const LanguageCatData = async () => {
  try {
    const data: Prisma.TestCategoryUncheckedCreateInput = {
      name: "زبان‌های خارجه",
      description: "آزمون‌های تعیین سطح زبان",
      isActive: true,
    };

    const category = await prisma.testCategory.upsert({
      where: { name: "زبان‌های خارجه" },
      update: data,
      create: data,
    });

    console.log("Language category inserted/updated.");
    return category;
  } catch (error) {
    console.error("Error inserting category:", error);
    process.exit(1);
  }
};

export default LanguageCatData;
