import prisma from "../../../config/prisma";

const ArabicData = async (categoryId: string) => {
  try {
    // بررسی وجود TestType با این نام
    const existing = await prisma.testType.findFirst({
      where: { name: "عربی" },
    });

    const data = {
      categoryId,
      name: "عربی",
      description: "آزمون جامع تعیین سطح زبان عربی",
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

    let arabicType;
    if (existing) {
      arabicType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      arabicType = await prisma.testType.create({
        data,
      });
    }

    console.log("Arabic Test Type successfully inserted!");
    return arabicType;
  } catch (error) {
    console.error("Arabic data failed:", error);
    throw error;
  }
};

export default ArabicData;
