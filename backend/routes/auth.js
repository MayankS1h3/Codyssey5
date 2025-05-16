
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/auth"); // <-- import your middleware
const router = express.Router();

const JWT_SECRET = "your_jwt_secret"; // Replace with env var in production

// Register
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ error: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Optionally, auto-login after signup:
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User created successfully",
      token,
      user: {
        username: newUser.username,
        email: newUser.email,
        leetcode: newUser.leetcode,
        codeforces: newUser.codeforces,
        gfg: newUser.gfg
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ 
      token, 
      user: {
        username: user.username,
        email: user.email,
        leetcode: user.leetcode,
        codeforces: user.codeforces,
        gfg: user.gfg
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user (for /auth/me endpoint)
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update platform usernames
router.post("/update-platforms", authenticate, async (req, res) => {
  const { leetcode, gfg, codeforces } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { leetcode, gfg, codeforces },
      { new: true }
    ).select("-password");
    res.json({ message: "Platforms updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;