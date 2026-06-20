import prisma from "../../../config/prisma";

const EnglishData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "انگلیسی" },
    });

    const data = {
      categoryId,
      name: "انگلیسی",
      description: "ازمون جامع تعیین سطح زبان انگلیسی",
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

    let englishType;
    if (existing) {
      englishType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      englishType = await prisma.testType.create({
        data,
      });
    }

    console.log("English Test Type successfully inserted!");
    return englishType;
  } catch (error) {
    console.error("English data failed:", error);
    process.exit(1);
  }
};

export default EnglishData;
