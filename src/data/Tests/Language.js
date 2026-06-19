const TestCategory = require("../../models/TestCategory");

const LanguageCatData = async () => {
  try{
    // Create "Language" Category
    const category = await TestCategory.findOneAndUpdate(
      { name: "زبان‌های خارجه" },
      { name: "زبان‌های خارجه", 
        isActive: true,
        description: "آزمون‌های تعیین سطح زبان" 
      }, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("language category inserted.");
    return category;
  }catch(error){
    console.error("Error inserting category:", error);
    process.exit(1);
  }
}

// LanguageCatData()
module.exports = LanguageCatData;