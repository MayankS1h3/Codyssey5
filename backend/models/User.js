
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  leetcode:    { type: String, default: "" },
  codeforces:  { type: String, default: "" },
  gfg:         { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
