const TestType = require("../../../models/TestType");

const AdobePsTypeData = async (categoryId) => {
    try {
        const psType = await TestType.findOneAndUpdate(
            { name: "Adobe Photoshop" },
            {
                categoryId: categoryId,
                name: "Adobe Photoshop",
                description: "سنجش مهارت در ویرایش تصویر، روتوش حرفه‌ای و ترکیب‌بندی با فتوشاپ",
                tags: ["Graphic Design", "Photo Editing", "Technical"],
                scoringMethod: "weighted_level",
                
                dimensions: [
                    "Selection & Masks", 
                    "Retouching & Healing", 
                    "Color Correction", 
                    "Layers & Smart Objects", 
                    "Filters & Effects", 
                    "Automation & Workflow"
                ],

                blueprint: {
                    "structure": {
                        "A1": { "Basics": 2, "Tools": 2 },
                        "A2": { "Layers": 2, "Selection": 2 },
                        "B1": { "Retouching": 2, "Adjustment": 2 },
                        "B2": { "SmartObjects": 2, "Masking": 2 },
                        "C1": { "ColorGrading": 2, "Compositing": 2 },
                        "C2": { "Automation": 1, "ProfessionalRetouch": 1 }
                    },
                    "levelWeights": {
                        "A1": 1, "A2": 1.5, "B1": 2.2, "B2": 3.5, "C1": 5, "C2": 7
                    },
                    "totalQuestions": 20, 
                    "timeLimit": 25
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("Adobe Photoshop Test Type Ready.");
        return psType;
    } catch (err) {
        console.error("Adobe PS Type Error:", err);
        throw err;
    }
}

module.exports = AdobePsTypeData;