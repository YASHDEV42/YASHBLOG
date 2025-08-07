const rateLimit = require("express-rate-limit");

// Enhanced rate limiter for production
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max: process.env.NODE_ENV === "development" ? max * 10 : max, // More lenient in development
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
  });
};

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later"
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests, please try again later"
);

const securityMiddleware = (req, res, next) => {
  // Enhanced security headers for production
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Enhanced CSP for production
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );

    // HSTS for production
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Log request for debugging
  console.log(
    `🔍 ${req.method} ${req.path} - Origin: ${req.get(
      "origin"
    )} - User-Agent: ${req.get("user-agent")?.substring(0, 50)}...`
  );

  next();
};

module.exports = {
  securityMiddleware,
  authLimiter,
  generalLimiter,
};
