const TestType = require("../../../models/TestType");

const AdobeAiTypeData = async (categoryId) => {
    try {
        const aiType = await TestType.findOneAndUpdate(
            { name: "Adobe Illustrator" },
            {
                categoryId: categoryId,
                name: "Adobe Illustrator",
                description: "سنجش تخصص در طراحی وکتور، لوگو و تایپوگرافی با Adobe Illustrator",
                tags: ["Technical", "Graphic Design", "Vector"],
                scoringMethod: "weighted_level",
                
                dimensions: [
                    "Vector Basics", 
                    "Path & Pen Tool", 
                    "Color & Gradients", 
                    "Pathfinder & Shapes", 
                    "Advanced Mesh & 3D", 
                    "Print & Web Export"
                ],

                blueprint: {
                    "structure": {
                        "A1": { "Basics": 2, "Selection": 1, "FillStroke": 1 },
                        "A2": { "Tools": 2, "Pathfinder": 1, "Groups": 1 },
                        "B1": { "PenTool": 1, "Masking": 1, "Brushes": 1 },
                        "B2": { "Appearance": 1, "Typography": 1, "Effects": 1 },
                        "C1": { "Mesh": 1, "3D": 1, "Perspective": 1 },
                        "C2": { "Automation": 1, "PrintTech": 1 }
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

        console.log("Adobe Illustrator Test Type Ready.");
        return aiType;
    } catch (err) {
        console.error("Adobe AI Type Error:", err);
        throw err;
    }
}

module.exports = AdobeAiTypeData;