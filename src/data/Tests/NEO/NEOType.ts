import prisma from "../../../config/prisma";

const NEOTestTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "NEO شخصیت پنج عاملی" },
    });

    const data = {
      categoryId,
      name: "NEO شخصیت پنج عاملی",
      description: "این آزمون پنج بعد اصلی شخصیت شما را با دقت تحلیل می‌کند.",
      scoringMethod: "trait_accumulation" as const,
      dimensions: ["N", "E", "O", "A", "C"],
      blueprint: {
        structure: {
          N: 6,
          E: 6,
          O: 6,
          A: 6,
          C: 6,
        },
        levelWeights: { General: 1 },
      },
    };

    let neoType;
    if (existing) {
      neoType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      neoType = await prisma.testType.create({
        data,
      });
    }

    console.log("NEO Test Type successfully inserted/updated!");
    return neoType;
  } catch (err) {
    console.error("NEO data failed:", err);
    process.exit(1);
  }
};

export default NEOTestTypeData;
