import express, { Request, Response, NextFunction, Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server, Socket } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import "dotenv/config";
import prisma from "./config/prisma";
// ===== اضافه شده: ماژول‌های امنیتی =====
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// @ts-ignore
import xss from "xss";
import vipRoutes from "./routes/VipRoutes";

// Middlewares
import {
  authenticateUser,
  authenticateAdmin,
} from "./middleware/authMidleware";

// Routes Imports
import UserRoutes from "./routes/UserRoutes";
import ProvinceRoutes from "./routes/ProvinceRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import AdCategoryRoutes from "./routes/AdCategoryRoutes";
import JobCategoryRoutes from "./routes/JobCategoryRoutes";
import OtpRoutes from "./routes/OtpRoutes";
import AdCategoryAttributesRoutes from "./routes/AdCategoryAttributesRoutes";
import RecentViewRoutes from "./routes/RecentViewRoutes";
import EmployerAdRoutes from "./routes/EmployerAdRoutes";
import SellerAdRoutes from "./routes/SellerAdRoutes";
import JobSeekerAdRoutes from "./routes/JobSeekerAdRoutes";
import DigitalAdRoutes from "./routes/DigitalAdRoutes";
import AdMarkRoutes from "./routes/AdMarkRoutes";
import userProfileRoutes from "./routes/UploadFileRoutes";
import UploadFileRoutes from "./routes/UploadFileRoutes";
import ChatRoutes from "./routes/ChatRoutes";
import StatsRoutes from "./routes/StatsRoutes";
import sessionRoutes from "./routes/SessionRoutes";
import reportReasonRoutes from "./routes/reportReasonRoutes";
import reportRoutes from "./routes/reportRoutes";
import TestRoutes from "./routes/TestRoutes";
import ResumeRoutes from "./routes/ResumeRoutes";
import converterRoutes from "./routes/converterRoutes";
import AdminExtensionsRoutes from "./routes/AdminExtensionsRoutes";
import UserExtensionsRoutes from "./routes/UserExtensionsRoutes";
import walletRoutes from "./routes/WalletRoutes";
import pricingRoutes from "./routes/PricingRoutes";
import checkoutRoutes from "./routes/CheckoutRoutes";
import purchaseRoutes from "./routes/PurchaseRoutes";
import paymentRoutes from "./routes/PaymentRoutes";

import adminAuthRoutes from "./Admin/routes/AuthRoutes";
import adminManagementRoutes from "./Admin/routes/AdminManagementRoutes";
import adManagementRoutes from './Admin/routes/AdManagementRoutes'
import adminPricingRoutes from './Admin/routes/PricingManagementRoutes'

import SuggestionRoutes from "./routes/SuggestionRoutes";

// ===== اضافه شده: مسیرهای مدیریت گزارش توسط ادمین =====
// import adminReportRoutes from "./routes/admin/adminReportRoutes"; // ✅ کامنت شد

import cron from "node-cron";
import { cleanExpiredAds } from "./jobs/cleanExpiredAds";
import { cleanPendingPaymentAds } from "./jobs/cleanPendingPaymentAds";
import { executeLadders } from './jobs/executeLadders'

import loadData from "./utils/dataLoader";
import fs from "fs";
import { join } from "path";

interface CustomSocket extends Socket {
  userId?: string;
}

interface SocketMessage {
  receiverId: string;
  [key: string]: any;
}

const app: Application = express();
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://barchasb.liara.run",
      "https://barchasb.org",
      "https://www.barchasb.org",
      "https://barchasb-main-server.ir",
      "https://www.barchasb-main-server.ir",
    ],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://barchasb.liara.run",
  "https://barchasb.org",
  "https://www.barchasb.org",
  "http://localhost:5000",
  "https://barchasb-apis.liara.run",
  "https://barchasb-main-server.ir",
  "https://www.barchasb-main-server.ir",
];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("این دامین اجازه دسترسی ندارد!"), false);
    }
  },
  credentials: true,
};

// ====================================================
// ========== MIDDLEWARES امنیتی (اضافه شده) ==========
// ====================================================

// 1. Helmet: محافظت از هدرهای HTTP
app.use(helmet());

// 2. CORS
app.use(cors(corsOptions));

// 3. Rate Limiting: جلوگیری از حملات Brute Force و DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
  max: 1000, // حداکثر ۱۰۰ درخواست از هر IP در بازه زمانی
  message: {
    success: false,
    message:
      "تعداد درخواست‌های شما از حد مجاز بیشتر شده، لطفاً بعداً تلاش کنید.",
  },
  standardHeaders: true, // ارسال `RateLimit-*` headers
  legacyHeaders: false, // غیرفعال کردن `X-RateLimit-*` headers
});
app.use(limiter);

// 4. HPP: جلوگیری از حملات HTTP Parameter Pollution
app.use(hpp());

// 5. XSS Protection: پاکسازی ورودی‌ها از کدهای مخرب XSS (جایگزین xss-clean)
app.use((req, res, next) => {
  // پاکسازی query
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key] as string);
      }
    }
  }
  // پاکسازی body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key] as string);
      }
    }
  }
  // پاکسازی params
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key] as string);
      }
    }
  }
  next();
});

// ====================================================
// ========== سایر MIDDLEWARES ========================
// ====================================================

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }),
);
app.use(cookieParser());

// ====================================================
// ========== ROUTE TEST (برای عیب‌یابی) ==============
// ====================================================
app.get("/test", (req: Request, res: Response) => {
  res.send("✅ Server is alive!");
});

/* =====================================================
   ================== SWAGGER SETUP ====================
   ===================================================== */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barchasb API",
      version: "1.0.0",
      description:
        "API documentation for Barchasb backend (including Admin APIs)",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    "./src/routes/**/*.ts",
    "./src/routes/**/*.js",
    "./src/Admin/routes/**/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
// fs.writeFileSync(
//   join(__dirname, "../openapi.json"),
//   JSON.stringify(swaggerSpec, null, 2),
// );

const swaggerUiOptions = {
  swaggerOptions: {
    requestInterceptor: (req: any) => {
      if (
        req.headers &&
        req.headers["Content-Type"] === "multipart/form-data"
      ) {
        delete req.headers["Content-Type"];
      }
      return req;
    },
  },
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

/* =====================================================
   ==================== ROUTES =========================
   ===================================================== */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "auth server main page" });
});

app.use("/api", reportReasonRoutes);
app.use("/api", reportRoutes);
app.use("/api", StatsRoutes);
app.use("/api", UserRoutes);
app.use("/api", ProvinceRoutes);
app.use("/api", ticketRoutes);
app.use("/api", AdCategoryRoutes);
app.use("/api", JobCategoryRoutes);
app.use("/api", sessionRoutes);
app.use("/api", AdCategoryAttributesRoutes);
app.use("/api", OtpRoutes);
app.use("/api", EmployerAdRoutes);
app.use("/api", SellerAdRoutes);
app.use("/api", JobSeekerAdRoutes);
app.use("/api", DigitalAdRoutes);
app.use("/api", AdMarkRoutes);
app.use("/api", RecentViewRoutes);
app.use("/api", userProfileRoutes);
app.use("/api", UploadFileRoutes);
app.use("/api", ChatRoutes);
app.use("/api", SuggestionRoutes);
app.use("/api", walletRoutes);
app.use("/api", pricingRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", paymentRoutes);
app.use("/api", vipRoutes);

// extensions routes
app.use("/api/tests", TestRoutes);
app.use("/api/resume", ResumeRoutes);
app.use("/api/converter", converterRoutes);
app.use("/api/user", UserExtensionsRoutes);
app.use("/api/admin/extension", AdminExtensionsRoutes);

// admin route
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/admins", adminManagementRoutes);
app.use('/api/admin/ads', adManagementRoutes);
app.use('/api/admin/pricing', adminPricingRoutes)

// ===== اضافه شده: مسیرهای مدیریت گزارش توسط ادمین =====
// app.use("/api/admin", adminReportRoutes); 

/* =====================================================
   =============== GLOBAL ERROR HANDLING ===============
   ===================================================== */

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "مسیر مورد نظر یافت نشد",
    error: "Not Found",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", err);

  let statusCode = err.status || 500;
  let message = err.message || "خطای داخلی سرور";
  let errorType = err.name || "InternalError";

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "حجم فایل ارسالی بیش از حد مجاز است (حداکثر ۵۰ مگابایت)";
    errorType = "FileTooLarge";
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "تعداد فایل‌های ارسالی بیش از حد مجاز است";
    errorType = "TooManyFiles";
  } else if (
    err.message &&
    err.message.includes("فرمت فایل پشتیبانی نمی‌شود")
  ) {
    statusCode = 400;
    message = err.message;
    errorType = "UnsupportedFileFormat";
  } else if (
    err instanceof SyntaxError &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    message = "فرمت JSON ارسالی نامعتبر است";
    errorType = "InvalidJSON";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
    errorType = "ValidationError";
  } else if (err.name === "UnauthorizedError" || err.status === 401) {
    statusCode = 401;
    message = "احراز هویت ناموفق";
    errorType = "Unauthorized";
  } else if (statusCode === 500) {
    if (process.env.NODE_ENV === "production") {
      message = "خطای داخلی سرور، لطفاً بعداً تلاش کنید";
      errorType = "InternalServerError";
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: errorType,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

/* =====================================================
   ================== SOCKET.IO LAYER ==================
   ===================================================== */
const onlineUsers = new Map<string, Set<string>>();
const lastSeenMap = new Map<string, Date>();

io.on("connection", (socket: CustomSocket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId }: { userId: string }) => {
    if (!userId) return;
    socket.userId = userId;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set<string>());
    onlineUsers.get(userId)!.add(socket.id);

    socket.join(userId);
    console.log(`✅ User ${userId} joined room ${userId}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));

    io.emit("userStatus", {
      userId,
      online: true,
      lastSeen: null,
    });
  });

  socket.on("getUserStatus", ({ userId }: { userId: string }) => {
    const isOnline = onlineUsers.has(userId);
    let lastSeen: Date | null = null;
    if (!isOnline) {
      lastSeen = lastSeenMap.get(userId) || new Date();
    }
    socket.emit("userStatus", {
      userId,
      online: isOnline,
      lastSeen,
    });
  });

  socket.on("sendMessage", (msg: SocketMessage) => {
    io.to(msg.receiverId).emit("receiveMessage", msg);
  });

  socket.on(
    "typing",
    ({ toUserId, isTyping }: { toUserId: string; isTyping: boolean }) => {
      const clients = onlineUsers.get(toUserId);
      if (clients && clients.size > 0) {
        io.to(toUserId).emit("typingStatus", {
          fromUserId: socket.userId,
          isTyping,
        });
      }
    },
  );

  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.get(userId)!.delete(socket.id);
      if (onlineUsers.get(userId)!.size === 0) {
        onlineUsers.delete(userId);
        const now = new Date();
        lastSeenMap.set(userId, now);
        console.log(`❌ User ${userId} is now offline (lastSeen: ${now})`);

        io.emit("userStatus", {
          userId,
          online: false,
          lastSeen: now,
        });
      }
    }
    console.log("User disconnected:", socket.id);
    console.log("Online users:", Array.from(onlineUsers.keys()));
  });
});

/* =====================================================
   ================ DATABASE & LIFECYCLE ===============
   ===================================================== */
const port = Number(process.env.PORT) || 5000;

cron.schedule("0 3 * * *", async () => {
  console.log("⏰ اجرای کرون جاب پاکسازی آگهی‌های منقضی...");
  await cleanExpiredAds();
});
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ اجرای کرون جاب پاکسازی آگهی‌های pending_payment...");
  await cleanPendingPaymentAds();
});
cron.schedule('*/5 * * * *', async () => {
  await executeLadders()
})

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma!");

    if (process.env.ENABLE_DATA_SEEDING === "true") {
      console.log("🌱 Starting data seeding...");
      try {
        await loadData();
        console.log("✅ Seeders finished successfully.");
      } catch (seedErr) {
        console.error("❌ Error during seeding:", seedErr);
      }
    } else {
      console.log("⏩ Data seeding skipped (ENABLE_DATA_SEEDING is not true)");
    }

    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📄 Swagger docs: http://localhost:${port}/api-docs`);
    });
    console.log("✅ Server listen called, waiting for connections...");
  } catch (err: unknown) {
    console.error(
      "❌ Failed to connect to PostgreSQL:",
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Server shut down gracefully.");
  process.exit(0);
});