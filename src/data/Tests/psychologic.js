const TestCategory = require('../../models/TestCategory');

const PsychologyCatData = async () => {
    try {
        const category = await TestCategory.findOneAndUpdate(
            { name: "روانشناسی" },
            {
                name: "روانشناسی" ,
                description: "آزمون‌های شخصیت، هوش هیجانی و استعداد شغلی.",
                isActive: true
            },
            { upsert: true, new: true }
        );
        console.log("Psychology Category Ready.");
        return category;
    } catch (err) {
        console.error("Error inserting category:", error);
        process.exit(1);
    }
};

module.exports = PsychologyCatData;