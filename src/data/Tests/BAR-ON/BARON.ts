import prisma from "../../../config/prisma";

const BarOnData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "Bar-On هوش هیجانی" },
    });

    const data = {
      categoryId,
      name: "Bar-On هوش هیجانی",
      description: "یک ابزار جامع برای سنجش هوش هیجانی و اجتماعی.",
      scoringMethod: "trait_accumulation" as const,
      dimensions: [
        "Emotional Self-Awareness",
        "Stress Management",
        "Interpersonal Skills",
        "Decision Making",
        "Adaptability",
      ],
      blueprint: {
        structure: { General: { Psychology: 30 } },
        levelWeights: { General: 1 },
      },
    };

    let barOn;
    if (existing) {
      barOn = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      barOn = await prisma.testType.create({
        data,
      });
    }

    console.log("Bar-On Test Type successfully inserted!");
    return barOn;
  } catch (err) {
    console.error("BAR-ON data failed:", err);
    process.exit(1);
  }
};

export default BarOnData;
