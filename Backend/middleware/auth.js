const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id; // Add userId for controller compatibility
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = auth;
