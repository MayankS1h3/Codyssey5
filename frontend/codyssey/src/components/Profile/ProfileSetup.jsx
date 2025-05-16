import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function ProfileSetup({ user, setUser }) {
  const [form, setForm] = useState({
    leetcode: user?.leetcode || "",
    gfg: user?.gfg || "",
    codeforces: user?.codeforces || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/update-platforms", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUser((prev) => ({ ...prev, ...form }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save platforms");
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Set your platform usernames
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="LeetCode Username"
            name="leetcode"
            value={form.leetcode}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="GFG Username"
            name="gfg"
            value={form.gfg}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Codeforces Username"
            name="codeforces"
            value={form.codeforces}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ProfileSetup;