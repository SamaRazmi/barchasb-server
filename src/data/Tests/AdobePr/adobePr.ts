import prisma from "../../../config/prisma";

const AdobePrTypeData = async (categoryId: string) => {
  try {
    // بررسی وجود TestType با این نام
    const existing = await prisma.testType.findFirst({
      where: { name: "Adobe Premiere Pro" },
    });

    const data = {
      categoryId,
      name: "Adobe Premiere Pro",
      description:
        "سنجش مهارت تدوین ویدیو و تسلط بر ابزارهای حرفه‌ای Adobe Premiere Pro",
      tags: ["Technical", "Video Editing", "Adobe"],
      scoringMethod: "weighted_level" as const,
      dimensions: [
        "Timeline & Basics",
        "Tools & Shortcuts",
        "Color Grading (Lumetri)",
        "Audio Mixing",
        "Motion Graphics",
        "Advanced Workflow (Proxy, MultiCam)",
      ],
      blueprint: {
        structure: {
          A1: { Basics: 2, Import: 1 },
          A2: { Tools: 2, Sequence: 1 },
          B1: { Color: 1, Audio: 2, Transitions: 1 },
          B2: { Keyframes: 2, Masking: 1, Graphics: 1 },
          C1: { Workflow: 2, Multicam: 1 },
          C2: { Export: 1, TimeRemapping: 2 },
        },
        levelWeights: {
          A1: 1,
          A2: 1.5,
          B1: 2,
          B2: 3,
          C1: 4,
          C2: 5,
        },
        totalQuestions: 20,
        timeLimit: 25,
      },
    };

    let prType;
    if (existing) {
      prType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      prType = await prisma.testType.create({
        data,
      });
    }

    console.log("Adobe Premiere Pro Test Type Ready.");
    return prType;
  } catch (err) {
    console.error("Adobe Pr Type Error:", err);
    throw err;
  }
};

export default AdobePrTypeData;