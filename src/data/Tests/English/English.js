const TestType = require("../../../models/TestType");

const EnglishData = async (categoryId) => {
  try{
    // -------------------20 questions ---------------------------------------------
    // Create the General English Type
    const englishType = await TestType.findOneAndUpdate(
      { name: "انگلیسی" },
      {
        categoryId: categoryId,
        name: "انگلیسی",
        category: "Language",
        description:"ازمون جامع تعیین سطح زبان انگلیسی",
        scoringMethod:"weighted_level",
        blueprint: {
          "structure": {
            "A1": { "Grammar": 1, "Vocabulary": 1},
            "A2": { "Grammar": 1, "Vocabulary": 1, "Preposition": 1 },
            "B1": { "Grammar": 2, "Vocabulary": 2, "Preposition": 1 },
            "B2": { "Grammar": 1, "Vocabulary": 2, "Preposition": 2 },
            "C1": { "Grammar": 1, "Vocabulary": 1, "Preposition": 1 },
            "C2": {               "Vocabulary": 1 , "Preposition": 1 }
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

    console.log("English Test Type successfully inserted!");
    return englishType;
  }catch(error){
    console.error("English data failed:", error);
    process.exit(1);
  }
};

// EnglishData();
module.exports = EnglishData;