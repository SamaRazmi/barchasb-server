const TestType = require('../../../models/TestType');

const BarOnData = async (categoryId) => {
    try {
        const barOn = await TestType.findOneAndUpdate(
            { name: "Bar-On هوش هیجانی" },
            {
                categoryId: categoryId,
                description: "یک ابزار جامع برای سنجش هوش هیجانی و اجتماعی.",
                scoringMethod: "trait_accumulation",
                dimensions: [
                    "Emotional Self-Awareness",
                    "Stress Management",
                    "Interpersonal Skills",
                    "Decision Making",
                    "Adaptability"
                ],
                blueprint: {
                    structure: { 
                        "General": { "Psychology": 30 } 
                    },
                    levelWeights: { "General": 1 }
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true}
        );
        console.log("Bar-On Test Type successfully inserted!");
        return barOn;
    } catch (err) {
        console.error("BAR-ON data failed:", err);
        process.exit(1);
    }
};

module.exports = BarOnData;
