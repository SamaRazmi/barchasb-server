import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

const MBTITypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "MBTI شخصیت شناسی" },
    });

    const data: Prisma.TestTypeUncheckedCreateInput = {
      categoryId,
      name: "MBTI شخصیت شناسی",
      description:
        "شناخته‌شده‌ترین تست شخصیت‌شناسی جهان که شما را در ۱۶ تیپ مختلف دسته‌بندی کرده و مسیر شغلی و ارتباطی شما را تحلیل می‌کند.",
      scoringMethod: "mbti_polar", // حالا بدون as any کار می‌کند
      dimensions: ["EI", "SN", "TF", "JP"],
      tags: [],
      blueprint: {
        structure: {
          EI: 8,
          SN: 8,
          TF: 7,
          JP: 7,
        },
        levelWeights: { General: 1 },
      },
    };

    let mbtiType;
    if (existing) {
      mbtiType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      mbtiType = await prisma.testType.create({
        data,
      });
    }

    console.log("MBTI Test Type successfully inserted!");
    return mbtiType;
  } catch (err) {
    console.error("MBTI data failed:", err);
    process.exit(1);
  }
};

export default MBTITypeData;
