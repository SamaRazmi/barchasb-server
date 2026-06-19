const TestType = require("../../../models/TestType");

const PythonTypeData = async (categoryId) => {
    try {
        const pythonType = await TestType.findOneAndUpdate(
            { name: "Python" },
            {
                categoryId: categoryId,
                name: "Python",
                description: "آزمون تخصصی سنجش مهارت برنامه نویسی پایتون از مقدماتی تا پیشرفته",
                tags: ["Technical", "Programming", "Back-end"],
                scoringMethod: "weighted_level",
                dimensions: [
                  "Basics", 
                  "Syntax", 
                  "DataStructures", 
                  "Functions", 
                  "OOP", 
                  "Advanced", 
                  "Async", 
                  "Internals", 
                  "Memory"
                ],
                blueprint: {
                  "structure": {
                      "A1": { "Basics": 2, "Syntax": 1, "DataTypes": 1 },
                      "A2": { "DataStructures": 2, "Logic": 1 },
                      "B1": { "Functions": 2, "OOP": 2, "Exceptions": 1 },
                      "B2": { "OOP": 1, "Advanced": 1, "Exceptions": 1 },
                      "C1": { "Async": 1, "Advanced": 2, "Internals": 1 },
                      "C2": { "Internals": 1, "Memory": 1 }
                  },
                  "levelWeights": {
                      "A1": 1, 
                      "A2": 1.5, 
                      "B1": 2.2, 
                      "B2": 3.2, 
                      "C1": 4.5, 
                      "C2": 6
                  },
                  "totalQuestions": 20, 
                  "timeLimit": 25 
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("Python Test Type (Technical) successfully inserted!");
        return pythonType;
    } catch (err) {
        console.error("Python data failed:", err);
        throw err;
    }
}

module.exports = PythonTypeData;