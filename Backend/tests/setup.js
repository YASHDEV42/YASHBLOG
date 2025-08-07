// Test setup file
const mongoose = require("mongoose");

// Mock console.log for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.TEST_MONGO_URL = "mongodb://localhost:27017/yashblog_test";

// Increase timeout for database operations
jest.setTimeout(30000);

// Global teardown
afterAll(async () => {
  // Close mongoose connection
  await mongoose.connection.close();
});
