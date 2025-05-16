

const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret"; // Use environment variable in production

function authenticate(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Store the full JWT payload
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;