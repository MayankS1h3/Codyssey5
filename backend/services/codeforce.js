
const axios = require("axios");

async function getCodeforcesProfile(username) {
  try {
    // Fetch general user profile
    const profileResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    const user = profileResponse.data.result[0];

    // Fetch submission history
    const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);

    const submissions = submissionsResponse.data.result;

    const solvedSet = new Set();
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    const recentSolved = [];

    for (const submission of submissions) {
      if (submission.verdict === "OK") {
        const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
        if (!solvedSet.has(problemKey)) {
          solvedSet.add(problemKey);

          // Add to recent solved (up to 10)
          if (recentSolved.length < 10) {
            recentSolved.push({
              name: submission.problem.name,
              contestId: submission.problem.contestId,
              index: submission.problem.index,
              rating: submission.problem.rating || "Unrated"
            });
          }

          // Count difficulty-wise (based on rating)
          const rating = submission.problem.rating || 0;
          if (rating >= 0 && rating <= 1200) difficultyStats.easy++;
          else if (rating > 1200 && rating <= 1800) difficultyStats.medium++;
          else if (rating > 1800) difficultyStats.hard++;
        }
      }
    }

    return {
      username: user.handle,
      rating: user.rating,
      maxRating: user.maxRating,
      rank: user.rank,
      maxRank: user.maxRank,
      totalSolved: solvedSet.size,
      difficultyStats,
      recentSolved
    };
  } catch (error) {
    console.error("Error fetching Codeforces profile:", error);
    return { error: "User not found or API issue" };
  }
}

module.exports = { getCodeforcesProfile };
