require("dotenv").config();

const seedProvinces = require("./seedProvinces");

const runSeeds = async () => {
  try {
    console.log("🌱 Seeding Provinces...");
    await seedProvinces();

    console.log("✅ All seeds completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

runSeeds();
