import prisma from "../../../config/prisma";

const LaravelTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "Laravel" },
    });

    const data = {
      categoryId,
      name: "Laravel",
      description:
        "سنجش تخصص در فریم‌ورک Laravel، معماری MVC، Eloquent ORM و اکوسیستم مدرن PHP",
      tags: ["Backend", "PHP", "Laravel", "MVC"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Architecture & Routing",
        "Eloquent ORM & DB",
        "Blade & Frontend",
        "Security & Auth",
        "Queues & Events",
        "Testing & Optimization",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Artisan: 2 },
          A2: { Eloquent: 2, Migrations: 2 },
          B1: { Middleware: 2, Validation: 2 },
          B2: { Auth: 2, Queues: 2 },
          C1: { Broadcasting: 2, Resources: 2 },
          C2: { Architecture: 1, Optimization: 1 },
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
        timeLimit: 25,
      },
    };

    let laravelType;
    if (existing) {
      laravelType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      laravelType = await prisma.testType.create({
        data,
      });
    }

    console.log("Laravel Test Type Ready.");
    return laravelType;
  } catch (err) {
    console.error("Laravel Type Error:", err);
    throw err;
  }
};

export default LaravelTypeData;
