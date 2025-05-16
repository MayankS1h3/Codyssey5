
const axios = require("axios");
const cheerio = require("cheerio");

async function getGfgProfile(username) {
  try {
    const url = `https://auth.geeksforgeeks.org/user/${username}/practice/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let solvedProblems = [];
    $(".problem-list-table tr").each((index, element) => {
      const problemName = $(element).find("td a").text().trim();
      if (problemName) {
        solvedProblems.push(problemName);
      }
    });

    const codingScore = $(".score_card_value").first().text().trim() || null;
    const instituteRank = $(".score_card_value").eq(1).text().trim() || null;
    const globalRank = $(".score_card_value").eq(2).text().trim() || null;

    // Practice stats if available
    const practiceStats = {};
    $(".score_cards .score_card_heading").each((i, el) => {
      const type = $(el).text().trim().toLowerCase();
      const value = $(el).next(".score_card_value").text().trim();
      if (type.includes("easy")) practiceStats.easy = value;
      else if (type.includes("medium")) practiceStats.medium = value;
      else if (type.includes("hard")) practiceStats.hard = value;
    });

    return {
      username,
      totalSolved: solvedProblems.length,
      recentSolvedProblems: solvedProblems.slice(0, 10), // recent 10
      codingScore,
      instituteRank,
      globalRank,
      practiceStats
    };
  } catch (error) {
    console.error("Error fetching GFG profile:", error);
    return { error: "Failed to fetch GFG profile data" };
  }
}

module.exports = { getGfgProfile };
