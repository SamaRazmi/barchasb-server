const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const {
  authenticateUser,
  authenticateAdmin,
} = require("./middleware/authMidleware");

// ✅ Swagger اضافه شد
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

require("dotenv/config");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://barchasb.liara.run",
      "https://barchasb.org",
      "https://www.barchasb.org",
      "https://barchasb-main-server.ir", // ➕ اضافه شد
      "https://www.barchasb-main-server.ir", // ➕ اضافه شد
    ],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

// لیست دامنه‌های مجاز برای CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://barchasb.liara.run",
  "https://barchasb.org",
  "https://www.barchasb.org",
  "http://localhost:5000",
  "https://barchasb-server.liara.run",
  "https://barchasb-main-server.ir", // ➕ اضافه شد
  "https://www.barchasb-main-server.ir", // ➕ اضافه شد
];

// CORS — اجازه عبور کوکی
const corsOptions = {
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

app.use(cors(corsOptions));

// Body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
);

// فعال کردن cookie parser
app.use(cookieParser());

/* =====================================================
   ================== SWAGGER SETUP ====================
   ===================================================== */

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Barchasb API",
      version: "1.0.0",
      description: "API documentation for Barchasb backend",
    },
    servers: [
      {
        url: "/",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  swaggerOptions: {
    requestInterceptor: (req) => {
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
   =====================================================
*/

// مسیر اصلی برای تست
app.get("/", (req, res) => {
  res.status(200).json({ msg: "auth server main page" });
});

// ROUTES
const UserRoutes = require("./routes/UserRoutes");
const ProvinceRoutes = require("./routes/ProvinceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const AdCategoryRoutes = require("./routes/AdCategoryRoutes");
const JobCategoryRoutes = require("./routes/JobCategoryRoutes");
const OtpRoutes = require("./routes/OtpRoutes");
const AdCategoryAttributesRoutes = require("./routes/AdCategoryAttributesRoutes");
const RecentViewRoutes = require("./routes/RecentViewRoutes");
const EmployerAdRoutes = require("./routes/EmployerAdRoutes");
const SellerAdRoutes = require("./routes/SellerAdRoutes");
const JobSeekerAdRoutes = require("./routes/JobSeekerAdRoutes");
const DigitalAdRoutes = require("./routes/DigitalAdRoutes");
const AdMarkRoutes = require("./routes/AdMarkRoutes");
const userProfileRoutes = require("./routes/UserProfileRoutes");
const UploadFileRoutes = require("./routes/UploadFileRoutes");
const ChatRoutes = require("./routes/ChatRoutes");
const StatsRoutes = require("./routes/StatsRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const reportReasonRoutes = require("./routes/reportReasonRoutes");
const reportRoutes = require("./routes/reportRoutes");

// اضافه کردن ROUTES
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

app.use("/api/tests", authenticateUser, require("./routes/TestRoutes"));
app.use("/api/resume", authenticateUser, require("./routes/ResumeRoutes"));
app.use(
  "/api/converter",
  authenticateUser,
  require("./routes/converterRoutes"),
);
app.use(
  "/api/admin",
  authenticateAdmin,
  require("./routes/AdminExtensionsRoutes"),
);
app.use(
  "/api/user",
  authenticateUser,
  require("./routes/UserExtensionsRoutes"),
);

// اتصال به MongoDB
const dbUrl = process.env.MONGO_URL;
const port = process.env.PORT || 5000;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📄 Swagger docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });

// Run Extensions Seeders
const loadData = require("./utils/dataLoader");
if (process.env.ENABLE_DATA_SEEDING === "true") {
  (async () => {
    console.log(" Starting data seeding...");
    await loadData();
    console.log("Seeders finished successfully.");
  })();
} else {
  console.log("Data seeding skipped (ENABLE_DATA_SEEDING is not true)");
}

// Global Error Handler
// --------------------------
// 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "مسیر مورد نظر یافت نشد",
    error: "Not Found",
  });
});
// error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  let statusCode = err.status || 500;
  let message = err.message || "خطای داخلی سرور";
  let errorType = err.name || "InternalError";

  // Multer error
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
  } else if (err instanceof SyntaxError && err.type === "entity.parse.failed") {
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

// ========== وضعیت آنلاین و آخرین بازدید ==========
const onlineUsers = new Map(); // key = userId, value = Set of socketIds
const lastSeenMap = new Map(); // userId -> lastSeen (Date)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // وقتی کاربر join می‌کند
  socket.on("join", ({ userId }) => {
    if (!userId) return;
    socket.userId = userId;

    // اضافه کردن socket به لیست آنلاین‌ها
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    socket.join(userId);
    console.log(`✅ User ${userId} joined room ${userId}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));

    // 🔹 به همه کاربران اطلاع بده که این کاربر آنلاین شد
    io.emit("userStatus", {
      userId,
      online: true,
      lastSeen: null,
    });
  });

  // 🔹 دریافت وضعیت یک کاربر خاص (درخواست از کلاینت)
  socket.on("getUserStatus", ({ userId }) => {
    const isOnline = onlineUsers.has(userId);
    let lastSeen = null;
    if (!isOnline) {
      // اگر آفلاین است، آخرین بازدید را از مپ یا دیتابیس بگیرید
      lastSeen = lastSeenMap.get(userId) || new Date();
    }
    // ارسال وضعیت فقط به همان کاربر درخواست‌کننده
    socket.emit("userStatus", {
      userId,
      online: isOnline,
      lastSeen,
    });
  });

  // ارسال پیام
  socket.on("sendMessage", (msg) => {
    io.to(msg.receiverId).emit("receiveMessage", msg);
  });

  // تایپ کردن
  socket.on("typing", ({ toUserId, isTyping }) => {
    const clients = onlineUsers.get(toUserId);
    if (clients && clients.size > 0) {
      io.to(toUserId).emit("typingStatus", {
        fromUserId: socket.userId,
        isTyping,
      });
    }
  });

  // کاربر disconnect شد
  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
        // ذخیره آخرین بازدید
        const now = new Date();
        lastSeenMap.set(userId, now);
        console.log(`❌ User ${userId} is now offline (lastSeen: ${now})`);

        // به همه اطلاع بده که کاربر آفلاین شد + آخرین بازدید
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
