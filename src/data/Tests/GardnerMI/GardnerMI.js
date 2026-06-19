const TestType = require('../../../models/TestType');

const GardnerMIData = async (categoryId) => {
    try {
        const gardner = await TestType.findOneAndUpdate(
            { name: "هوش‌های چندگانه گاردنر" },
            {
                categoryId: categoryId,
                description: "این آزمون ۸ جنبه مختلف توانمندی‌های ذهنی شما را بر اساس نظریه هوارد گاردنر تحلیل می‌کند.",
                scoringMethod: "likert_sum",
                dimensions: [
                    "Linguistic", "Mathematical", "Visual", "Kinesthetic", 
                    "Musical", "Interpersonal", "Intrapersonal", "Naturalistic"
                ],
                blueprint: {
                    structure: { 
                        "Linguistic": 4, 
                        "Mathematical": 4, 
                        "Visual": 4, 
                        "Kinesthetic": 4, 
                        "Musical": 4, 
                        "Interpersonal": 4, 
                        "Intrapersonal": 3, 
                        "Naturalistic": 3 
                    },
                    levelWeights: { "General": 1 }
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("Gardner MI Test Type successfully inserted!");
        return gardner;
    } catch (err) {
        console.error("Gardner MI data failed:", err);
        process.exit(1);
    }
};

module.exports = GardnerMIData;