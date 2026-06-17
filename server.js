import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import setupSwagger from "./swagger.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();


// =================== App ===================
const app = express();
const PORT = process.env.PORT || 5000;

// =================== Middleware ===================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// =================== Swagger ===================
setupSwagger(app);

// =================== Routes ===================
app.use("/api", userRoutes);

// =================== Health Check ===================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});

// =================== DB Test ===================
app.get("/api/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "ok", message: "DB connected" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// =================== Start Server ===================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// =================== Graceful Shutdown ===================
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
