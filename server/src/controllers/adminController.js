const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendDailyForecastBatch } = require("../jobs/dailyForecastJob");

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

const disableUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  user.isActive = false;
  user.disabledAt = new Date();
  await user.save();

  res.json({ message: "User disabled successfully." });
});

const getLogs = asyncHandler(async (_req, res) => {
  const logs = await LoginLog.find().sort({ createdAt: -1 }).limit(200);
  res.json({ logs });
});

const getStats = asyncHandler(async (_req, res) => {
  const [users, activeUsers, disabledUsers, unusualLogins] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    LoginLog.countDocuments({ unusual: true, success: true })
  ]);

  res.json({
    stats: {
      users,
      activeUsers,
      disabledUsers,
      unusualLogins
    }
  });
});

const broadcast = asyncHandler(async (_req, res) => {
  const result = await sendDailyForecastBatch();
  res.json({
    message: "Broadcast completed.",
    result
  });
});

module.exports = {
  getUsers,
  disableUser,
  getLogs,
  getStats,
  broadcast
};
