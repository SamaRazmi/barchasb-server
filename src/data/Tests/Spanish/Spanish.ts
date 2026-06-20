import prisma from "../../../config/prisma";

const SpanishTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "اسپانیایی" },
    });

    const data = {
      categoryId,
      name: "اسپانیایی",
      description: "آزمون جامع تعیین سطح زبان اسپانیایی",
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

    let spanishType;
    if (existing) {
      spanishType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      spanishType = await prisma.testType.create({
        data,
      });
    }

    console.log("Spanish Test Type successfully inserted!");
    return spanishType;
  } catch (error) {
    console.error("Spanish data failed:", error);
    process.exit(1);
  }
};

export default SpanishTypeData;
