import prisma from "../../../config/prisma";

const FrenchTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "فرانسوی" },
    });

    const data = {
      categoryId,
      name: "فرانسوی",
      description: "آزمون جامع تعیین سطح زبان فرانسوی",
      scoringMethod: "weighted_level" as const,
      blueprint: {
        structure: {
          A1: { Grammar: 1, Vocabulary: 1 },
          A2: { Grammar: 1, Vocabulary: 1, Preposition: 1 },
          B1: { Grammar: 2, Vocabulary: 2, Preposition: 1 },
          B2: { Grammar: 1, Vocabulary: 2, Preposition: 2 },
          C1: { Grammar: 1, Vocabulary: 1, Preposition: 1 },
          C2: { Vocabulary: 1, Preposition: 1 },
        },
        levelWeights: {
          A1: 1,
          A2: 2,
          B1: 3,
          B2: 4,
          C1: 5,
          C2: 6,
        },
        totalQuestions: 20,
        timeLimit: 30,
      },
    };

    let frenchType;
    if (existing) {
      frenchType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      frenchType = await prisma.testType.create({
        data,
      });
    }

    console.log("French Test Type successfully inserted!");
    return frenchType;
  } catch (err) {
    console.error("French data failed:", err);
    process.exit(1);
  }
};

export default FrenchTypeData;
