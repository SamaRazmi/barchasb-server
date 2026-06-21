import prisma from "../../../config/prisma";

const NestJSTestTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "NestJS" },
    });

    const data = {
      categoryId,
      name: "NestJS",
      description:
        "سنجش تخصص در فریم‌ورک NestJS، معماری ماژولار، TypeScript و Microservices",
      tags: ["Backend", "Node.js", "TypeScript", "NestJS"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Modular Architecture",
        "Dependency Injection & Providers",
        "Lifecycle Hooks & Middleware",
        "Security (Guards & Auth)",
        "Microservices & WebSockets",
        "Databases (TypeORM/Prisma)",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 1, CLI: 1 },
          A2: { Modules: 2, Controllers: 2 },
          B1: { Pipes: 2, Guards: 2 },
          B2: { Interceptors: 2, TypeORM: 2 },
          C1: { Microservices: 2, WebSockets: 2 },
          C2: { CQRS: 1, Architecture: 1 },
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

    let nestJsType;
    if (existing) {
      nestJsType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      nestJsType = await prisma.testType.create({
        data,
      });
    }

    console.log("NestJS Test Type Ready.");
    return nestJsType;
  } catch (err) {
    console.error("NestJS Type Error:", err);
    throw err;
  }
};

export default NestJSTestTypeData;
