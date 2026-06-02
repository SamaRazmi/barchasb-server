const TestType = require("../../../models/TestType");

const SpanishData = async (categoryId) => {
  try {
    const spanishType = await TestType.findOneAndUpdate(
      { name: "اسپانیایی" },
      {
        categoryId: categoryId,
        name: "اسپانیایی",
        category: "Language",
        description: "آزمون جامع تعیین سطح زبان اسپانیایی",
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

    console.log("Spanish Test Type successfully inserted!");
    return spanishType;
  } catch (error) {
    console.error("Spanish data failed:", error);
    process.exit(1);
  }
};

module.exports = SpanishData;