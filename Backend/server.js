const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Import security middleware with fallback
let apiLimiter, securityHeaders;
try {
  const securityMiddleware = require("./middleware/security.js");
  apiLimiter = securityMiddleware.apiLimiter;
  securityHeaders = securityMiddleware.securityHeaders;
} catch (error) {
  console.warn("⚠️ Security middleware not available, using fallbacks");
  apiLimiter = (req, res, next) => next();
  securityHeaders = (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  };
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000", // Development
      "https://yashblog-hazel.vercel.app", // Production frontend
      process.env.FRONTEND_URL, // Environment variable
    ].filter(Boolean);

    console.log("🌍 Request origin:", origin);
    console.log("✅ Allowed origins:", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Origin not allowed by CORS:", origin);
      // In development, be more lenient
      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
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

// Security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// General rate limiting for all API routes
app.use("/api", apiLimiter);

// Health check endpoint (before other routes)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes with better error handling
try {
  app.use("/api/user", require("./routes/userRoutes"));
  console.log("✅ User routes loaded");
} catch (error) {
  console.error("❌ Error loading user routes:", error.message);
}

try {
  // Ensure postRoutes.js exists
  const postRoutes = require("./routes/postRoutes");
  app.use("/api/post", postRoutes);
  console.log("✅ Post routes loaded");
} catch (error) {
  console.error("❌ Error loading post routes:", error.message);
  // Create fallback for missing post routes
  app.use("/api/post", (req, res) => {
    res.status(503).json({
      error: "Post service temporarily unavailable",
      message: "Please try again later",
    });
  });
}

try {
  app.use("/api/comment", require("./routes/commentRoutes.js"));
  console.log("✅ Comment routes loaded");
} catch (error) {
  console.error("❌ Error loading comment routes:", error.message);
}

try {
  app.use("/api/notification", require("./routes/notificationRoutes"));
  console.log("✅ Notification routes loaded");
} catch (error) {
  console.error("❌ Error loading notification routes:", error.message);
}

// Catch-all route for undefined API endpoints
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Error Handling Middleware (must be last)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;

// Add environment validation
const requiredEnvVars = ["MONGO_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

const startServer = async () => {
  try {
    // Validate required environment variables
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is required");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

startServer();
