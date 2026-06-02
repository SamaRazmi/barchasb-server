const TestType = require("../../../models/TestType");

const SqlTypeData = async (categoryId) => {
    try {
        const sqlType = await TestType.findOneAndUpdate(
            { name: "SQL" },
            {
                categoryId: categoryId,
                name: "SQL",
                description: "سنجش مهارت در طراحی دیتابیس، کوئری‌نویسی",
                tags: ["Database", "SQL", "Backend", "Data Analysis", "Queries"],
                scoringMethod: "weighted_level",
                
                dimensions: [
                    "Data Manipulation", 
                    "Joins & Relations", 
                    "Database Design", 
                    "Functions & Aggregates", 
                    "Transactions & Concurrency", 
                    "Optimization & Indexing"
                ],

                blueprint: {
                    "structure": {
                        "A1": { "BasicSyntax": 1, "Filtering": 1}, 
                        "A2": { "Joins": 1, "Aggregations": 2 },
                        "B1": { "CRUD": 2, "Subqueries": 3 },
                        "B2": { "SchemaDesign": 3, "Constraints": 2 },
                        "C1": { "Transactions": 2, "StoredProcedures": 1 },
                        "C2": { "Indexing": 1, "Optimization": 1 } 
                    },
                    "levelWeights": {
                        "A1": 1, 
                        "A2": 1.5, 
                        "B1": 2.5, 
                        "B2": 4, 
                        "C1": 6, 
                        "C2": 8
                    },
                    "totalQuestions": 20,
                    "timeLimit": 25
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("SQL Test Type Ready.");
        return sqlType;
    } catch (err) {
        console.error("SQL Type Error:", err);
        throw err;
    }
}

module.exports = SqlTypeData;