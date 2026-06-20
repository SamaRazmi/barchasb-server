import prisma from "../../../config/prisma";

const HollandTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "رغبت‌سنجی شغلی هالند" },
    });

    const data = {
      categoryId,
      name: "رغبت‌سنجی شغلی هالند",
      description:
        "این تست بر اساس مدل RIASEC، تمایلات شغلی شما را در ۶ لایه تحلیل کرده و بهترین محیط‌های کاری را به شما پیشنهاد می‌دهد.",
      scoringMethod: "likert_sum" as const,
      dimensions: ["R", "I", "A", "S", "E", "C"],
      blueprint: {
        structure: {
          R: 5,
          I: 5,
          A: 5,
          S: 5,
          E: 5,
          C: 5,
        },
        levelWeights: { General: 1 },
        totalQuestions: 30,
      },
    };

    let hollandType;
    if (existing) {
      hollandType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      hollandType = await prisma.testType.create({
        data,
      });
    }

    console.log("Holland Test Type successfully inserted!");
    return hollandType;
  } catch (err) {
    console.error("Holland data failed:", err);
    process.exit(1);
  }
};

export default HollandTypeData;
