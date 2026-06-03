const TestType = require('../../../models/TestType');

const HollandData = async (categoryId) => {
    try {
        const holland = await TestType.findOneAndUpdate(
            { name: "رغبت‌سنجی شغلی هالند" },
            {
                categoryId: categoryId,
                description: "این تست بر اساس مدل RIASEC، تمایلات شغلی شما را در ۶ لایه تحلیل کرده و بهترین محیط‌های کاری را به شما پیشنهاد می‌دهد.",
                scoringMethod: "likert_sum",
                dimensions: ["R", "I", "A", "S", "E", "C"],
                blueprint: {
                    structure: { 
                        "R": 5, // واقع‌گرا (Realistic)
                        "I": 5, // جستجوگر (Investigative)
                        "A": 5, // هنری (Artistic)
                        "S": 5, // اجتماعی (Social)
                        "E": 5, // متهور (Enterprising)
                        "C": 5  // قراردادی (Conventional)
                    },
                    levelWeights: { "General": 1 },
                    totalQuestions: 30,
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("Holland Test Type successfully inserted!");
        return holland;
    } catch (err) {
        console.error("Holland data failed:", err);
        process.exit(1);
    }
};

module.exports = HollandData;