// Test script to verify backend validation messages
const axios = require("axios");

async function testValidation() {
  try {
    console.log("Testing password validation...");

    const response = await axios.post(
      "http://localhost:5000/api/user/register",
      {
        name: "Test User",
        email: "test@example.com",
        password: "weak", // This should trigger validation error
      }
    );

    console.log("Unexpected success:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Error data:", error.response.data);
      console.log("Message:", error.response.data.message);
    } else {
      console.log("Network error:", error.message);
    }
  }
}

testValidation();
