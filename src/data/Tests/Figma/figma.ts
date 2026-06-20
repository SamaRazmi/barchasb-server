import prisma from "../../../config/prisma";

const FigmaTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "Figma" },
    });

    const data = {
      categoryId,
      name: "Figma",
      description: "سنجش تخصص در طراحی رابط و تجربه کاربری (UI/UX) با فیگما",
      tags: ["Design", "UI", "UX", "Product Design", "Figma"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Interface & Tools",
        "Auto Layout & Constraints",
        "Components & Variants",
        "Design Systems & Styles",
        "Prototyping & Variables",
        "Handoff & Workflow",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 1, Layers: 1 },
          A2: { AutoLayout: 2, Constraints: 1 },
          B1: { Components: 2, Properties: 3 },
          B2: { Styles: 3, Libraries: 2 },
          C1: { Prototyping: 2, Variables: 1 },
          C2: { AdvancedWorkflow: 1, DevMode: 1 },
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

    let figmaType;
    if (existing) {
      figmaType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      figmaType = await prisma.testType.create({
        data,
      });
    }

    console.log("Figma Test Type Ready.");
    return figmaType;
  } catch (err) {
    console.error("Figma Type Error:", err);
    throw err;
  }
};

export default FigmaTypeData;