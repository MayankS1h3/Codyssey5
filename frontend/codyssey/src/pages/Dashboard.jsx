import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import ProblemStats from "../components/Dashboard/ProblemStats";
import RecentSubmissions from "../components/Dashboard/RecentSubmissions";
import HeatMap from "../components/Dashboard/HeatMap";
import PracticeProblems from "../components/Dashboard/PracticeProblems";
import UpcomingContests from "../components/Dashboard/UpcomingContests";

// You should pass 'user' as a prop from your App or context, and ensure it contains platform usernames
function Dashboard({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile setup if any platform username is missing
    if (!user?.leetcode || !user?.gfg || !user?.codeforces) {
      navigate("/profile-setup");
    }
  }, [user, navigate]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ProblemStats />
      </Grid>
      <Grid item xs={12} md={6}>
        <RecentSubmissions />
      </Grid>
      <Grid item xs={12} md={8}>
        <HeatMap />
      </Grid>
      <Grid item xs={12} md={4}>
        <PracticeProblems />
        <UpcomingContests />
      </Grid>
    </Grid>
  );
}

export default Dashboard;