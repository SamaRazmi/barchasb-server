import prisma from "../../../config/prisma";

const GardnerMIData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "هوش‌های چندگانه گاردنر" },
    });

    const data = {
      categoryId,
      name: "هوش‌های چندگانه گاردنر",
      description:
        "این آزمون ۸ جنبه مختلف توانمندی‌های ذهنی شما را بر اساس نظریه هوارد گاردنر تحلیل می‌کند.",
      scoringMethod: "likert_sum" as const,
      dimensions: [
        "Linguistic",
        "Mathematical",
        "Visual",
        "Kinesthetic",
        "Musical",
        "Interpersonal",
        "Intrapersonal",
        "Naturalistic",
      ],
      blueprint: {
        structure: {
          Linguistic: 4,
          Mathematical: 4,
          Visual: 4,
          Kinesthetic: 4,
          Musical: 4,
          Interpersonal: 4,
          Intrapersonal: 3,
          Naturalistic: 3,
        },
        levelWeights: { General: 1 },
      },
    };

    let gardnerType;
    if (existing) {
      gardnerType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      gardnerType = await prisma.testType.create({
        data,
      });
    }

    console.log("Gardner MI Test Type successfully inserted!");
    return gardnerType;
  } catch (err) {
    console.error("Gardner MI data failed:", err);
    process.exit(1);
  }
};

export default GardnerMIData;
