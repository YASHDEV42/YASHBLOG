const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
/*
Purpose:
It loads variables from a .env file into process.env.
*/
const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allows cookies to be sent with requests));
    /*
Purpose:
Enables Cross-Origin Resource Sharing (CORS) so that your frontend can make requests to your
backend without being blocked by the browser's same-origin policy.
*/
  })
);

app.use(cookieParser());

/* 
Purpose:
Allows your frontend (e.g., on localhost:3000) to communicate with your backend (e.g., on localhost:5000), which are on different origins.
Without CORS, the browser will block the requests due to same-origin policy.
*/
app.use(express.json());
/*
Purpose:
Purpose:
Tells Express to automatically parse incoming requests with Content-Type: application/json and make it available in req.body.
*/

// API Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/comment", require("./routes/commentRoutes.js"));
app.use("/api/notification", require("./routes/notificationRoutes"));
// Error Handling Middleware
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

startServer();
