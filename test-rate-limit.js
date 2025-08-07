// Test script to verify rate limiting error messages
const axios = require("axios");

async function testRateLimit() {
  console.log("Testing rate limiting by making multiple login attempts...");

  for (let i = 1; i <= 7; i++) {
    try {
      console.log(`\nAttempt ${i}:`);

      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: "fake@example.com",
          password: "wrongpassword",
        }
      );

      console.log("Unexpected success:", response.data);
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Error data:", error.response.data);

        if (error.response.status === 429) {
          console.log("✅ Rate limit triggered!");
          console.log("Error message:", error.response.data.error);
          console.log("Retry after:", error.response.data.retryAfter);
          break;
        } else {
          console.log(
            "Expected auth error (401):",
            error.response.data.message
          );
        }
      } else {
        console.log("Network error:", error.message);
      }
    }

    // Small delay between attempts
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

testRateLimit();
