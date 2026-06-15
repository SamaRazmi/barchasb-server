const { connectDB } = require("../db");
const AdCategory = require("../models/AdCategory");
const categoriesJSON = require("../data/adCategoriesData.js");

const seedCategories = async () => {
  await connectDB();

  for (const cat of categoriesJSON) {
    // بررسی اینکه دسته از قبل وجود دارد یا خیر
    const exists = await AdCategory.findOne({ name: cat.name });
    if (!exists) {
      let parentId = null;
      if (cat.parent) {
        const parent = await AdCategory.findOne({
          name: categoriesJSON.find((c) => c.id === cat.parent).name,
        });
        if (parent) parentId = parent._id;
      }

      await AdCategory.create({
        name: cat.name,
        parent: parentId,
      });
    }
  }

  console.log("Categories inserted/updated successfully!");
};

module.exports = seedCategories;
