import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Link } from "@mui/material";
import api from "../../api/api";

function UpcomingContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContests() {
      try {
        const res = await api.get("/dashboard/upcoming-contests");
        setContests(res.data); // [{ name, url, platform, date }]
      } catch (err) {
        setContests([]);
      }
      setLoading(false);
    }
    fetchContests();
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

  if (!contests.length) {
    return (
      <Card>
        <CardContent>
          <Typography>No upcoming contests.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Contests
        </Typography>
        <List dense>
          {contests.map((c, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={
                  <Link href={c.url} target="_blank" rel="noopener">
                    {c.name}
                  </Link>
                }
                secondary={`${c.platform} — ${new Date(c.date).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default UpcomingContests;