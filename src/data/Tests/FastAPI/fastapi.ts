import prisma from "../../../config/prisma";

const FastApiTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "FastAPI" },
    });

    const data = {
      categoryId,
      name: "FastAPI",
      description: "سنجش تخصص در ساخت APIهای مدرن، سریع و ایمن با Python FastAPI",
      tags: ["Backend", "Python", "API", "Async"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Routing & Parameters",
        "Pydantic & Validation",
        "Dependency Injection",
        "Security & Auth",
        "Database & Async",
        "Advanced WebSockets & Tasks",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Routing: 2 },
          A2: { Pydantic: 2, Parameters: 2 },
          B1: { DI: 2, Exceptions: 2 },
          B2: { Security: 2, BackgroundTasks: 2 },
          C1: { Databases: 2, WebSockets: 2 },
          C2: { Architecture: 1, Deployment: 1 },
        },
        levelWeights: {
          A1: 1,
          A2: 1.5,
          B1: 2.2,
          B2: 3.5,
          C1: 5,
          C2: 7,
        },
        totalQuestions: 20,
        timeLimit: 20,
      },
    };

    let fastApiType;
    if (existing) {
      fastApiType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      fastApiType = await prisma.testType.create({
        data,
      });
    }

    console.log("FastAPI Test Type Ready.");
    return fastApiType;
  } catch (err) {
    console.error("FastAPI Type Error:", err);
    throw err;
  }
};

export default FastApiTypeData;