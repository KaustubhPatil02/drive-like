const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization"); // Get Authorization header
  if (!authHeader) return res.status(401).json({ error: "Access Denied" });

  const token = authHeader.split(" ")[1]; // Extract actual JWT token
  if (!token) return res.status(401).json({ error: "Invalid Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
