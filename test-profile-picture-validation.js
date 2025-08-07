// Test script to verify profile picture URL validation
const axios = require("axios");

async function testProfilePictureValidation() {
  const baseURL = "http://localhost:5000/api";

  // Test cases for profile picture URLs
  const testCases = [
    {
      name: "Valid imgur URL",
      url: "https://i.imgur.com/example.jpg",
      shouldPass: true,
    },
    {
      name: "Valid gravatar URL",
      url: "https://www.gravatar.com/avatar/example.jpg",
      shouldPass: true,
    },
    {
      name: "Invalid javascript URL",
      url: "javascript:alert('xss')",
      shouldPass: false,
    },
    {
      name: "Invalid data URL",
      url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
      shouldPass: false,
    },
    {
      name: "Untrusted domain",
      url: "https://malicious-site.com/image.jpg",
      shouldPass: false,
    },
    {
      name: "Empty URL (should be allowed)",
      url: "",
      shouldPass: true,
    },
    {
      name: "Valid cloudinary URL",
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      shouldPass: true,
    },
  ];

  console.log("Testing profile picture URL validation...\n");

  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      console.log(`URL: ${testCase.url || "(empty)"}`);

      const response = await axios.put(
        `${baseURL}/user/profile/test-user-id`,
        {
          profilePicture: testCase.url,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (testCase.shouldPass) {
        console.log("✅ PASS - Request accepted as expected");
      } else {
        console.log("❌ FAIL - Request should have been rejected");
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        console.log("✅ PASS - Request rejected as expected");
        console.log(
          `   Error: ${error.response?.data?.message || error.message}`
        );
      } else {
        console.log("❌ FAIL - Request should have been accepted");
        console.log(
          `   Error: ${error.response?.data?.message || error.message}`
        );
      }
    }

    console.log("");
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testProfilePictureValidation()
    .then(() => console.log("Profile picture validation tests completed"))
    .catch((err) => console.error("Test suite failed:", err));
}

module.exports = { testProfilePictureValidation };
