// Enhanced security middleware
const rateLimit = require("express-rate-limit");

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: "Too many requests from this IP, please try again later",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later",
      retryAfter: "15 minutes",
    });
  },
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 10 : 50, // 10 in production, 50 in development
  message: {
    error: "Too many authentication attempts, try again later",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts, please try again later",
      retryAfter: "15 minutes",
    });
  },
});

// Moderate rate limiting for content creation
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 posts/comments per minute
  message: {
    error: "Too many posts created, please slow down",
    retryAfter: "1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "You're creating content too quickly, please slow down",
      retryAfter: "1 minute",
    });
  },
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'"
  );

  // Remove Express header
  res.removeHeader("X-Powered-By");

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  createLimiter,
  securityHeaders,
};
