import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

const PsychologyCatData = async () => {
  try {
    const data: Prisma.TestCategoryUncheckedCreateInput = {
      name: "روانشناسی",
      description: "آزمون‌های شخصیت، هوش هیجانی و استعداد شغلی.",
      isActive: true,
    };

    const category = await prisma.testCategory.upsert({
      where: { name: "روانشناسی" },
      update: data,
      create: data,
    });

    console.log("Psychology Category Ready.");
    return category;
  } catch (error) {
    console.error("Error inserting category:", error);
    process.exit(1);
  }
};

export default PsychologyCatData;
