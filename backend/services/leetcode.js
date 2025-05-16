
const axios = require('axios');

async function getLeetCodeProfile(username, submissionsLimit = 15) {
  const url = 'https://leetcode.com/graphql';
  
  // Updated query to fetch both profile data and recent submissions
  const query = `
    query getUserProfileAndSubmissions($username: String!, $limit: Int!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        statusDisplay
        timestamp
        lang
      }
    }
  `;

  try {
    const response = await axios.post(url, {
      query,
      variables: { 
        username,
        limit: submissionsLimit // Configurable limit with default value
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/`
      }
    });
    
    if (!response.data?.data?.matchedUser) {
      throw new Error('No user data found');
    }

    const user = response.data.data.matchedUser;
    const recentSubmissions = response.data.data.recentAcSubmissionList || [];

    const easy = user.submitStats.acSubmissionNum.find(x => x.difficulty === 'Easy').count;
    const medium = user.submitStats.acSubmissionNum.find(x => x.difficulty === 'Medium').count;
    const hard = user.submitStats.acSubmissionNum.find(x => x.difficulty === 'Hard').count;

    return {
      username: user.username,
      realName: user.profile.realName,
      ranking: user.profile.ranking,
      problemsSolved: {
        easy,
        medium,
        hard,
        total: easy + medium + hard
      },
      recentSubmissions: recentSubmissions
    };
  } catch (error) {
    console.error(`Error fetching LeetCode profile for ${username}:`, error.message);
    throw error;
  }
}

module.exports = { getLeetCodeProfile };
