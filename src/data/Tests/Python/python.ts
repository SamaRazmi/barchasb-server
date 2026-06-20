import prisma from "../../../config/prisma";

const PythonTestTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "Python" },
    });

    const data = {
      categoryId,
      name: "Python",
      description:
        "آزمون تخصصی سنجش مهارت برنامه نویسی پایتون از مقدماتی تا پیشرفته",
      tags: ["Technical", "Programming", "Back-end"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Basics",
        "Syntax",
        "DataStructures",
        "Functions",
        "OOP",
        "Advanced",
        "Async",
        "Internals",
        "Memory",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Syntax: 1, DataTypes: 1 },
          A2: { DataStructures: 2, Logic: 1 },
          B1: { Functions: 2, OOP: 2, Exceptions: 1 },
          B2: { OOP: 1, Advanced: 1, Exceptions: 1 },
          C1: { Async: 1, Advanced: 2, Internals: 1 },
          C2: { Internals: 1, Memory: 1 },
        },
        levelWeights: {
          A1: 1,
          A2: 1.5,
          B1: 2.2,
          B2: 3.2,
          C1: 4.5,
          C2: 6,
        },
        totalQuestions: 20,
        timeLimit: 25,
      },
    };

    let pythonType;
    if (existing) {
      pythonType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      pythonType = await prisma.testType.create({
        data,
      });
    }

    console.log("Python Test Type (Technical) successfully inserted!");
    return pythonType;
  } catch (err) {
    console.error("Python data failed:", err);
    throw err;
  }
};

export default PythonTestTypeData;
