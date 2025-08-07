// Input validation and sanitization utilities
const validator = require("validator");

/**
 * Validate and sanitize user input
 */
class InputValidator {
  // Email validation
  static validateEmail(email) {
    if (!email || typeof email !== "string") {
      return { isValid: false, message: "Email is required" };
    }

    const sanitized = email.trim().toLowerCase();

    if (!validator.isEmail(sanitized)) {
      return { isValid: false, message: "Invalid email format" };
    }

    return { isValid: true, sanitized };
  }

  // Password validation
  static validatePassword(password) {
    if (!password || typeof password !== "string") {
      return { isValid: false, message: "Password is required" };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }

    if (password.length > 128) {
      return { isValid: false, message: "Password too long" };
    }

    // Check for at least one number, one lowercase, one uppercase
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one number, one lowercase and one uppercase letter",
      };
    }

    return { isValid: true, sanitized: password };
  }

  // Name validation
  static validateName(name) {
    if (!name || typeof name !== "string") {
      return { isValid: false, message: "Name is required" };
    }

    const sanitized = name.trim();

    if (sanitized.length < 2) {
      return {
        isValid: false,
        message: "Name must be at least 2 characters long",
      };
    }

    if (sanitized.length > 50) {
      return {
        isValid: false,
        message: "Name must be less than 50 characters",
      };
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(sanitized)) {
      return {
        isValid: false,
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes",
      };
    }

    return { isValid: true, sanitized };
  }

  // Post title validation
  static validateTitle(title) {
    if (!title || typeof title !== "string") {
      return { isValid: false, message: "Title is required" };
    }

    const sanitized = validator.escape(title.trim());

    if (sanitized.length < 3) {
      return {
        isValid: false,
        message: "Title must be at least 3 characters long",
      };
    }

    if (sanitized.length > 200) {
      return {
        isValid: false,
        message: "Title must be less than 200 characters",
      };
    }

    return { isValid: true, sanitized };
  }

  // Post content validation
  static validateContent(content) {
    if (!content || typeof content !== "string") {
      return { isValid: false, message: "Content is required" };
    }

    const sanitized = content.trim();

    if (sanitized.length < 10) {
      return {
        isValid: false,
        message: "Content must be at least 10 characters long",
      };
    }

    if (sanitized.length > 50000) {
      return {
        isValid: false,
        message: "Content is too long (max 50,000 characters)",
      };
    }

    return { isValid: true, sanitized };
  }

  // Comment validation
  static validateComment(comment) {
    if (!comment || typeof comment !== "string") {
      return { isValid: false, message: "Comment is required" };
    }

    const sanitized = validator.escape(comment.trim());

    if (sanitized.length < 1) {
      return { isValid: false, message: "Comment cannot be empty" };
    }

    if (sanitized.length > 1000) {
      return {
        isValid: false,
        message: "Comment must be less than 1000 characters",
      };
    }

    return { isValid: true, sanitized };
  }

  // Bio validation
  static validateBio(bio) {
    if (!bio) return { isValid: true, sanitized: "" };

    if (typeof bio !== "string") {
      return { isValid: false, message: "Bio must be text" };
    }

    const sanitized = validator.escape(bio.trim());

    if (sanitized.length > 500) {
      return {
        isValid: false,
        message: "Bio must be less than 500 characters",
      };
    }

    return { isValid: true, sanitized };
  }

  // Category validation
  static validateCategories(categories) {
    if (!categories) return { isValid: true, sanitized: [] };

    if (!Array.isArray(categories)) {
      return { isValid: false, message: "Categories must be an array" };
    }

    if (categories.length > 5) {
      return { isValid: false, message: "Maximum 5 categories allowed" };
    }

    const sanitized = categories
      .map((cat) => {
        if (typeof cat !== "string") return "";
        return validator.escape(cat.trim().toLowerCase());
      })
      .filter((cat) => cat.length > 0 && cat.length <= 30);

    return { isValid: true, sanitized };
  }

  // Profile picture URL validation
  static validateProfilePictureUrl(url) {
    if (!url || typeof url !== "string") {
      return { isValid: true, sanitized: "" }; // Empty URL is allowed (will use default)
    }

    const trimmed = url.trim();

    if (trimmed === "") {
      return { isValid: true, sanitized: "" };
    }

    // Check if it's a valid URL
    if (
      !validator.isURL(trimmed, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
      })
    ) {
      return { isValid: false, message: "Invalid URL format" };
    }

    // Check URL length
    if (trimmed.length > 500) {
      return { isValid: false, message: "URL too long (max 500 characters)" };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
      /<script/i,
      /onclick/i,
      /onerror/i,
      /onload/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
      return { isValid: false, message: "URL contains unsafe content" };
    }

    // Whitelist common image hosting domains for extra security
    const allowedDomains = [
      "imgur.com",
      "i.imgur.com",
      "github.com",
      "raw.githubusercontent.com",
      "gravatar.com",
      "www.gravatar.com",
      "secure.gravatar.com",
      "cloudinary.com",
      "res.cloudinary.com",
      "unsplash.com",
      "images.unsplash.com",
      "pexels.com",
      "images.pexels.com",
      "pixabay.com",
      "cdn.pixabay.com",
      "imagekit.io",
      "firebasestorage.googleapis.com",
      "s3.amazonaws.com",
      "storage.googleapis.com",
    ];

    try {
      const urlObj = new URL(trimmed);
      const hostname = urlObj.hostname.toLowerCase();

      // Check if domain is in whitelist or is a subdomain of allowed domain
      const isAllowed = allowedDomains.some(
        (domain) => hostname === domain || hostname.endsWith("." + domain)
      );

      if (!isAllowed) {
        return {
          isValid: false,
          message: "URL must be from a trusted image hosting service",
        };
      }

      // Check file extension for image files
      const pathname = urlObj.pathname.toLowerCase();
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".bmp",
      ];
      const hasImageExtension = imageExtensions.some((ext) =>
        pathname.endsWith(ext)
      );

      // Some services don't have extensions in URL, so we'll allow those from trusted domains
      // but warn if there's no image extension
      if (!hasImageExtension && !pathname.includes("/")) {
        return {
          isValid: false,
          message: "URL should point to an image file",
        };
      }
    } catch (error) {
      return { isValid: false, message: "Invalid URL format" };
    }

    return { isValid: true, sanitized: trimmed };
  }
}

module.exports = InputValidator;
