const TestCategory = require("../../models/TestCategory");

const TechnicalCatData = async () => {
  try {
    const category = await TestCategory.findOneAndUpdate(
      { name: "مهارتی و تخصصی" },
      { 
        name: "مهارتی و تخصصی", 
        isActive: true,
        description: "آزمون‌های سنجش میزان تسلط بر ابزارها و مهارت‌های فنی و نرم‌افزاری",
      }, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("-----------------------------------------");
    console.log("Technical/Skill category inserted/updated.");
    console.log(`ID: ${category._id}`);
    console.log("-----------------------------------------");
    
    return category;
  } catch (error) {
    console.error("Error inserting technical category:", error);
    throw error; 
  }
}

module.exports = TechnicalCatData;