const InputValidator = require('../middleware/inputValidator');

describe('InputValidator', () => {
  describe('validateEmail', () => {
    test('should validate correct email', () => {
      const result = InputValidator.validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });

    test('should reject invalid email', () => {
      const result = InputValidator.validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid email format');
    });

    test('should handle empty email', () => {
      const result = InputValidator.validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email is required');
    });

    test('should sanitize email (trim and lowercase)', () => {
      const result = InputValidator.validateEmail('  TEST@EXAMPLE.COM  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });
  });

  describe('validatePassword', () => {
    test('should validate strong password', () => {
      const result = InputValidator.validatePassword('Password123');
      expect(result.isValid).toBe(true);
    });

    test('should reject short password', () => {
      const result = InputValidator.validatePassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must be at least 8 characters long');
    });

    test('should reject password without uppercase', () => {
      const result = InputValidator.validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one number, one lowercase and one uppercase letter');
    });

    test('should reject password without lowercase', () => {
      const result = InputValidator.validatePassword('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one number, one lowercase and one uppercase letter');
    });

    test('should reject password without number', () => {
      const result = InputValidator.validatePassword('Password');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must contain at least one number, one lowercase and one uppercase letter');
    });

    test('should reject too long password', () => {
      const longPassword = 'A'.repeat(130) + '1a';
      const result = InputValidator.validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password too long');
    });
  });

  describe('validateName', () => {
    test('should validate correct name', () => {
      const result = InputValidator.validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('John Doe');
    });

    test('should reject short name', () => {
      const result = InputValidator.validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name must be at least 2 characters long');
    });

    test('should reject long name', () => {
      const longName = 'A'.repeat(51);
      const result = InputValidator.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name must be less than 50 characters');
    });

    test('should reject name with numbers', () => {
      const result = InputValidator.validateName('John123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    test('should accept name with hyphens and apostrophes', () => {
      const result = InputValidator.validateName("Mary-Jane O'Connor");
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe("Mary-Jane O'Connor");
    });

    test('should trim whitespace', () => {
      const result = InputValidator.validateName('  John Doe  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('John Doe');
    });
  });

  describe('validateTitle', () => {
    test('should validate correct title', () => {
      const result = InputValidator.validateTitle('My Blog Post');
      expect(result.isValid).toBe(true);
    });

    test('should reject short title', () => {
      const result = InputValidator.validateTitle('Hi');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Title must be at least 3 characters long');
    });

    test('should reject long title', () => {
      const longTitle = 'A'.repeat(201);
      const result = InputValidator.validateTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Title must be less than 200 characters');
    });
  });

  describe('validateContent', () => {
    test('should validate correct content', () => {
      const result = InputValidator.validateContent('This is a blog post content with enough characters.');
      expect(result.isValid).toBe(true);
    });

    test('should reject short content', () => {
      const result = InputValidator.validateContent('Short');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Content must be at least 10 characters long');
    });

    test('should reject extremely long content', () => {
      const longContent = 'A'.repeat(50001);
      const result = InputValidator.validateContent(longContent);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Content is too long (max 50,000 characters)');
    });
  });

  describe('validateCategories', () => {
    test('should validate correct categories', () => {
      const result = InputValidator.validateCategories(['tech', 'programming']);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toEqual(['tech', 'programming']);
    });

    test('should reject too many categories', () => {
      const result = InputValidator.validateCategories(['a', 'b', 'c', 'd', 'e', 'f']);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Maximum 5 categories allowed');
    });

    test('should handle empty categories', () => {
      const result = InputValidator.validateCategories([]);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toEqual([]);
    });

    test('should filter out long categories', () => {
      const longCategory = 'a'.repeat(31);
      const result = InputValidator.validateCategories(['tech', longCategory, 'programming']);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toEqual(['tech', 'programming']);
    });

    test('should convert to lowercase and trim', () => {
      const result = InputValidator.validateCategories(['  TECH  ', 'Programming']);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toEqual(['tech', 'programming']);
    });
  });
});
