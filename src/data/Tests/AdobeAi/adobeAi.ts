import prisma from "../../../config/prisma";

const AdobeAiTypeData = async (categoryId: string) => {
  try {
    // بررسی وجود TestType با این نام
    const existing = await prisma.testType.findFirst({
      where: { name: "Adobe Illustrator" },
    });

    const data = {
      categoryId,
      name: "Adobe Illustrator",
      description:
        "سنجش تخصص در طراحی وکتور، لوگو و تایپوگرافی با Adobe Illustrator",
      tags: ["Technical", "Graphic Design", "Vector"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Vector Basics",
        "Path & Pen Tool",
        "Color & Gradients",
        "Pathfinder & Shapes",
        "Advanced Mesh & 3D",
        "Print & Web Export",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Selection: 1, FillStroke: 1 },
          A2: { Tools: 2, Pathfinder: 1, Groups: 1 },
          B1: { PenTool: 1, Masking: 1, Brushes: 1 },
          B2: { Appearance: 1, Typography: 1, Effects: 1 },
          C1: { Mesh: 1, "3D": 1, Perspective: 1 },
          C2: { Automation: 1, PrintTech: 1 },
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

    let aiType;
    if (existing) {
      aiType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      aiType = await prisma.testType.create({
        data,
      });
    }

    console.log("Adobe Illustrator Test Type Ready.");
    return aiType;
  } catch (err) {
    console.error("Adobe AI Type Error:", err);
    throw err;
  }
};

export default AdobeAiTypeData;
