import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Link } from "@mui/material";
import api from "../../api/api";

function RecentSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await api.get("/dashboard/recent-submissions");
        setSubmissions(res.data);
      } catch (err) {
        setSubmissions([]);
      }
      setLoading(false);
    }
    fetchSubmissions();
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

  if (!submissions.length) {
    return (
      <Card>
        <CardContent>
          <Typography>No recent submissions found.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Submissions
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>Problem</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((sub, idx) => (
              <TableRow key={idx}>
                <TableCell>{sub.platform}</TableCell>
                <TableCell>
                  <Link href={sub.url} target="_blank" rel="noopener">
                    {sub.title}
                  </Link>
                </TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>{new Date(sub.date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default RecentSubmissions;