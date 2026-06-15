require("dotenv").config();
const seedCategories = require("./adSeedCategories");

const runSeeds = async () => {
  try {
    console.log("🌱 Seeding Ad Categories...");
    await seedCategories();
    console.log("✅ All ad category seeds completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

runSeeds();
