const {
  getDashboardStats,
  getAnalysesByUser
} = require("../repositories/memoryRepository");

async function dashboard(req, res) {
  const stats = await getDashboardStats(req.userId);
  const recentTests = (await getAnalysesByUser(req.userId)).slice(0, 5);

  res.json({
    success: true,
    stats,
    recentTests
  });
}

module.exports = { dashboard };
