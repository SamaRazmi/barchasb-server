require("dotenv").config();
const seedCategories = require("./jobSeedCategories");

const runSeeds = async () => {
  try {
    console.log("🌱 Seeding Job Categories...");
    await seedCategories(); // اینجا باید seedCategories صدا زده شود
    console.log("✅ All job category seeds completed!");
    process.exit(); // اینجا باید خروجی موفقیت آمیز باشد
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

runSeeds();
