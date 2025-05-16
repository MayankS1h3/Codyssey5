import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import api from "../../api/api";

// For demo: simple color squares for days, real-world would use a library like react-calendar-heatmap
function HeatMap() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await api.get("/dashboard/heatmap");
        setActivity(res.data); // [{ date: "2024-04-01", count: 2 }, ...]
      } catch (err) {
        setActivity([]);
      }
      setLoading(false);
    }
    fetchActivity();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (!activity.length) {
    return (
      <Card>
        <CardContent>
          <Typography>No activity yet.</Typography>
        </CardContent>
      </Card>
    );
  }

  // Basic grid: last 35 days, 7x5
  const lastDays = 35;
  const today = new Date();
  const days = [];
  for (let i = lastDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const found = activity.find((a) => a.date === dateStr);
    days.push({ date: dateStr, count: found ? found.count : 0 });
  }

  const getColor = (count) => {
    if (count > 4) return "#388e3c";
    if (count > 2) return "#66bb6a";
    if (count > 0) return "#c8e6c9";
    return "#e0e0e0";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activity Heatmap (Last 35 days)
        </Typography>
        <Box display="flex" flexWrap="wrap" width={210}>
          {days.map((d, idx) => (
            <Box
              key={d.date}
              m={0.2}
              width={24}
              height={24}
              bgcolor={getColor(d.count)}
              borderRadius={1}
              title={`${d.date}: ${d.count} problems`}
              border="1px solid #eee"
              display="inline-block"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default HeatMap;