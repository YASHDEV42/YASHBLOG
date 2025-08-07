const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.TEST_MONGO_URL || "mongodb://localhost:27017/yashblog_test"
    );
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("POST /api/user/register", () => {
    const validUser = {
      email: "test@example.com",
      name: "Test User",
      password: "Password123",
    };

    test("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send(validUser)
        .expect(201);

      expect(response.body.user.email).toBe(validUser.email);
      expect(response.body.user.name).toBe(validUser.name);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    test("should reject registration with invalid email", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({
          ...validUser,
          email: "invalid-email",
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid email format");
    });

    test("should reject registration with weak password", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({
          ...validUser,
          password: "weak",
        })
        .expect(400);

      expect(response.body.message).toBe(
        "Password must be at least 8 characters long"
      );
    });

    test("should reject registration with invalid name", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({
          ...validUser,
          name: "A",
        })
        .expect(400);

      expect(response.body.message).toBe(
        "Name must be at least 2 characters long"
      );
    });

    test("should reject duplicate email registration", async () => {
      // First registration
      await request(app).post("/api/user/register").send(validUser).expect(201);

      // Second registration with same email
      const response = await request(app)
        .post("/api/user/register")
        .send(validUser)
        .expect(400);

      expect(response.body.message).toBe("User already exists");
    });

    test("should handle rate limiting", async () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/user/register")
          .send({
            ...validUser,
            email: `test${i}@example.com`,
          });
      }

      // 6th request should be rate limited
      const response = await request(app)
        .post("/api/user/register")
        .send({
          ...validUser,
          email: "test6@example.com",
        })
        .expect(429);

      expect(response.body.error).toContain("Too many authentication attempts");
    });
  });

  describe("POST /api/user/login", () => {
    const validUser = {
      email: "test@example.com",
      name: "Test User",
      password: "Password123",
    };

    beforeEach(async () => {
      // Create a user for login tests
      await request(app).post("/api/user/register").send(validUser);
    });

    test("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: validUser.email,
          password: validUser.password,
        })
        .expect(200);

      expect(response.body.user.email).toBe(validUser.email);
      expect(response.body.user.name).toBe(validUser.name);
      expect(response.body.user.password).toBeUndefined();
    });

    test("should reject login with invalid email", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: "wrong@example.com",
          password: validUser.password,
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    test("should reject login with invalid password", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: validUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    test("should reject login with malformed email", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: "invalid-email",
          password: validUser.password,
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid email format");
    });
  });
});
