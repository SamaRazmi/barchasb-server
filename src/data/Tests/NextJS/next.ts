import prisma from "../../../config/prisma";

const NextJSTestTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "Next.js" },
    });

    const data = {
      categoryId,
      name: "Next.js",
      description: "سنجش مهارت در فریم‌ورک Next.js",
      tags: ["Frontend", "React", "NextJS", "Fullstack"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Routing & Layouts",
        "Rendering Strategies (SSR/SSG/ISR)",
        "Data Fetching & Caching",
        "Optimization (Images/Fonts/Bundle)",
        "Server Components & Actions",
        "Middleware & Security",
        "Advanced Patterns (Parallel/Intercepting)",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Syntax: 2 },
          A2: { Routing: 1, Navigation: 1 },
          B1: { Rendering: 2, DataFetching: 2 },
          B2: { Optimization: 2, APIRoutes: 2 },
          C1: { Middleware: 1, AdvancedHooks: 1, Security: 2 },
          C2: { Architecture: 1, Internals: 1 },
        },
        levelWeights: {
          A1: 1,
          A2: 1.5,
          B1: 2.5,
          B2: 4,
          C1: 6,
          C2: 8,
        },
        totalQuestions: 20,
        timeLimit: 25,
      },
    };

    let nextJsType;
    if (existing) {
      nextJsType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      nextJsType = await prisma.testType.create({
        data,
      });
    }

    console.log("Next.js Test Type Ready.");
    return nextJsType;
  } catch (err) {
    console.error("Next.js Type Error:", err);
    throw err;
  }
};

export default NextJSTestTypeData;
