const TestType = require("../../../models/TestType");

const ArabicData = async (categoryId) => {
  try {
    const arabicType = await TestType.findOneAndUpdate(
      { name: "عربی" },
      {
        categoryId: categoryId,
        name: "عربی",
        category: "Language",
        description: "آزمون جامع تعیین سطح زبان عربی",
        scoringMethod: "weighted_level",
        blueprint: {
          "structure": {
            "A1": { "Grammar": 1, "Vocabulary": 1 },
            "A2": { "Grammar": 1, "Vocabulary": 1, "Preposition": 1 },
            "B1": { "Grammar": 2, "Vocabulary": 2, "Preposition": 1 },
            "B2": { "Grammar": 1, "Vocabulary": 2, "Preposition": 2 },
            "C1": { "Grammar": 1, "Vocabulary": 1, "Preposition": 1 },
            "C2": {               "Vocabulary": 1, "Preposition": 1 }
          },
          "levelWeights": {
            "A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6
          },
          "totalQuestions": 20,
          "timeLimit": 30,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("Arabic Test Type successfully inserted!");
    return arabicType;
  } catch (error) {
    console.error("Arabic data failed:", error);
  }
};

module.exports = ArabicData;