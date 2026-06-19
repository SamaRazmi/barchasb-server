const TestType = require('../../../models/TestType');

const MBTIData = async (categoryId) => {
    try {
        const mbti = await TestType.findOneAndUpdate(
            { name:"MBTI شخصیت شناسی" },
            {
                categoryId: categoryId,
                description: "شناخته‌شده‌ترین تست شخصیت‌شناسی جهان که شما را در ۱۶ تیپ مختلف دسته‌بندی کرده و مسیر شغلی و ارتباطی شما را تحلیل می‌کند.",
                scoringMethod: "mbti_polar",
                dimensions: ["EI", "SN", "TF", "JP"],
                blueprint: {
                    structure: { 
                        "EI": 8, // محور برون‌گرایی - درون‌گرایی
                        "SN": 8, // محور حسی - شهودی
                        "TF": 7, // محور منطقی - احساسی
                        "JP": 7  // محور قضاوت‌گر - ادراکی
                    },
                    levelWeights: { "General": 1 }
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("MBTI Test Type successfully inserted!");
        return mbti;
    } catch (err) {
        console.error("MBTI data failed:", err);
        process.exit(1);
    }
};

module.exports = MBTIData;