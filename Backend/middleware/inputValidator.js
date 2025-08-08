const validator = require("validator");

class InputValidator {
  // Email validation
  static validateEmail(email) {
    if (!email || typeof email !== "string") {
      return { isValid: false, message: "Email is required" };
    }

    if (!validator.isEmail(email)) {
      return { isValid: false, message: "Please provide a valid email" };
    }

    return { isValid: true, sanitized: email.toLowerCase().trim() };
  }

  // Password validation
  static validatePassword(password) {
    if (!password || typeof password !== "string") {
      return { isValid: false, message: "Password is required" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        message: "Password must be at least 6 characters long",
      };
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one uppercase letter and one number",
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

    if (sanitized.length > 10) {
      return {
        isValid: false,
        message: "Name must be less than 10 characters",
      };
    }

    return { isValid: true, sanitized };
  }

  // Post title validation
  static validateTitle(title) {
    if (!title || typeof title !== "string") {
      return {
        isValid: false,
        message: "Title is required and must be a string",
      };
    }

    const sanitized = title.trim();

    if (sanitized.length < 3) {
      return {
        isValid: false,
        message: "Title must be at least 3 characters long",
      };
    }

    if (sanitized.length > 100) {
      return {
        isValid: false,
        message: "Title must be less than 100 characters",
      };
    }

    return { isValid: true, sanitized };
  }

  // Post content validation
  static validateContent(content) {
    if (!content || typeof content !== "string") {
      return {
        isValid: false,
        message: "Content is required and must be a string",
      };
    }

    const sanitized = content.trim();

    if (sanitized.length < 10) {
      return {
        isValid: false,
        message: "Content must be at least 10 characters long",
      };
    }
    if (sanitized.length > 10000) {
      return {
        isValid: false,
        message: "Content must be less than 10000 characters",
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
    if (!categories) {
      return { isValid: true, sanitized: [] };
    }

    if (!Array.isArray(categories)) {
      return { isValid: false, message: "Categories must be an array" };
    }

    const sanitized = categories
      .filter((cat) => typeof cat === "string")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    return { isValid: true, sanitized };
  }

  // Profile picture URL validation
  static validateProfilePictureUrl(url) {
    if (!url || typeof url !== "string") {
      return { isValid: true, sanitized: "" }; // Profile picture is optional
    }

    const sanitized = url.trim();

    if (!validator.isURL(sanitized)) {
      return { isValid: false, message: "Invalid profile picture URL" };
    }
    return { isValid: true, sanitized };
  }
}

module.exports = InputValidator;
