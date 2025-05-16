import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Grid } from "@mui/material";
import api from "../../api/api";

function ProblemStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/dashboard/problem-stats");
        setStats(res.data);
      } catch (err) {
        setStats(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={120}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Failed to load stats.</Typography>
        </CardContent>
      </Card>
    );
  }

  // stats should look like:
  // { leetcode: { total: 100, easy: 40, medium: 45, hard: 15 }, codeforces: {...}, gfg: {...} }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Problems Solved (by Platform & Difficulty)
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(stats).map(([platform, values]) => (
            <Grid item xs={12} sm={4} key={platform}>
              <Box>
                <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
                  {platform}
                </Typography>
                <Typography variant="body2">
                  Total: <b>{values.total}</b>
                </Typography>
                <Typography variant="body2" color="success.main">
                  Easy: {values.easy}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  Medium: {values.medium}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Hard: {values.hard}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProblemStats;