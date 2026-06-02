const TestType = require("../../../models/TestType");

const NestJsTypeData = async (categoryId) => {
    try {
        const nestJsType = await TestType.findOneAndUpdate(
            { name: "NestJS" },
            {
                categoryId: categoryId,
                name: "NestJS",
                description: "سنجش تخصص در فریم‌ورک NestJS، معماری ماژولار، TypeScript و Microservices",
                tags: ["Backend", "Node.js", "TypeScript", "NestJS"],
                scoringMethod: "weighted_level",
                
                dimensions: [
                    "Modular Architecture", 
                    "Dependency Injection & Providers", 
                    "Lifecycle Hooks & Middleware", 
                    "Security (Guards & Auth)", 
                    "Microservices & WebSockets", 
                    "Databases (TypeORM/Prisma)"
                ],

                blueprint: {
                    "structure": {
                        "A1": { "Basics": 2, "CLI": 2 },
                        "A2": { "Modules": 2, "Controllers": 2 },
                        "B1": { "Pipes": 2, "Guards": 2 },
                        "B2": { "Interceptors": 2, "TypeORM": 2 },
                        "C1": { "Microservices": 2, "WebSockets": 2 },
                        "C2": { "CQRS": 1, "Architecture": 1 }
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

        console.log("NestJS Test Type Ready.");
        return nestJsType;
    } catch (err) {
        console.error("NestJS Type Error:", err);
        throw err;
    }
}

module.exports = NestJsTypeData;