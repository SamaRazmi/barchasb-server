import prisma from "./config/prisma";

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma!");
  } catch (err: any) {
    console.error("❌ Failed to connect to the database:", err.message);
    process.exit(1);
  }
};

export { connectDB };
