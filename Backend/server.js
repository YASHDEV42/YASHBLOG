const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler.js");
const { apiLimiter, securityHeaders } = require("./middleware/security.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000", // Development
      process.env.FRONTEND_URL, // Production frontend URL
      "https://yashblog-hazel.vercel.app",
    ].filter(Boolean);

    console.log("🌍 Request origin:", origin);
    console.log("✅ Allowed origins:", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Origin not allowed by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cookie",
  ],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers - with error handling
try {
  if (securityHeaders && typeof securityHeaders === "function") {
    app.use(securityHeaders);
  } else {
    console.warn(
      "⚠️ securityHeaders middleware not available, using basic security headers"
    );
    app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });
  }
} catch (error) {
  console.error("❌ Error loading security middleware:", error.message);
  // Fallback security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
}

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// General rate limiting for all API routes - with error handling
try {
  if (apiLimiter && typeof apiLimiter === "function") {
    app.use("/api", apiLimiter);
  } else {
    console.warn(
      "⚠️ apiLimiter middleware not available, skipping rate limiting"
    );
  }
} catch (error) {
  console.error("❌ Error loading rate limiter:", error.message);
}

// Health check endpoint (before rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/comment", require("./routes/commentRoutes.js"));
app.use("/api/notification", require("./routes/notificationRoutes"));

// 404 handler for undefined routes
app.use(notFound);

// Error Handling Middleware (must be last)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

startServer();
