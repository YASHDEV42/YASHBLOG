const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      return res.status(401).json({ message: "Invalid token." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = auth;
