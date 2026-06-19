const TestType = require('../../../models/TestType');

const NEOData = async (categoryId) => {
    try {
        const neo = await TestType.findOneAndUpdate(
            { name: "NEO شخصیت پنج عاملی" },
            {
                categoryId: categoryId,
                description: "این آزمون پنج بعد اصلی شخصیت شما را با دقت تحلیل می‌کند.",
                scoringMethod: "trait_accumulation", 
                dimensions: ["N", "E", "O", "A", "C"],
                blueprint: {
                    structure: { 
                        "N": 6,
                        "E": 6, 
                        "O": 6, 
                        "A": 6, 
                        "C": 6 
                    },
                    levelWeights: { "General": 1 }
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("NEO Test Type successfully inserted/updated!");
        return neo;
    } catch (err) {
        console.error("NEO data failed:", err);
        process.exit(1);
    }
};

module.exports = NEOData;