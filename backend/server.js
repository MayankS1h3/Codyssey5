
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const { getLeetCodeProfile } = require("./services/leetcode");
const { getCodeforcesProfile } = require("./services/codeforce");
const { getGfgProfile } = require("./services/gfg");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// --- FIXED CORS CONFIGURATION ---
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server origin
  credentials: true                // Allow cookies and Authorization headers
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Fetch profile data from platforms
app.post("/api/fetch-profile", async (req, res) => {
  const { leetcode, gfg, codeforces } = req.body;

  if (!leetcode && !gfg && !codeforces) {
    return res.status(400).json({ error: "At least one username must be provided!" });
  }

  try {
    const [leetcodeData, gfgData, codeforcesData] = await Promise.allSettled([
      leetcode ? getLeetCodeProfile(leetcode) : Promise.resolve({ error: "LeetCode username missing" }),
      gfg ? getGfgProfile(gfg) : Promise.resolve({ error: "GFG username missing" }),
      codeforces ? getCodeforcesProfile(codeforces) : Promise.resolve({ error: "Codeforces username missing" })
    ]);

    res.json({
      leetcode: leetcodeData.status === "fulfilled" ? leetcodeData.value : { error: "Failed to fetch LeetCode data" },
      gfg: gfgData.status === "fulfilled" ? gfgData.value : { error: "Failed to fetch GFG data" },
      codeforces: codeforcesData.status === "fulfilled" ? codeforcesData.value : { error: "Failed to fetch Codeforces data" }
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});