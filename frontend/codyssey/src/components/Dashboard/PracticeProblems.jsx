import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Link } from "@mui/material";
import api from "../../api/api";

function PracticeProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await api.get("/dashboard/practice-problems");
        setProblems(res.data); // [{ title, url, platform }]
      } catch (err) {
        setProblems([]);
      }
      setLoading(false);
    }
    fetchProblems();
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

  if (!problems.length) {
    return (
      <Card>
        <CardContent>
          <Typography>No practice problems recommended.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Practice Problems (Random 5)
        </Typography>
        <List dense>
          {problems.map((prob, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={
                  <Link href={prob.url} target="_blank" rel="noopener">
                    {prob.title}
                  </Link>
                }
                secondary={prob.platform}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default PracticeProblems;