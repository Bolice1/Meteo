const User = require("../models/User");
const { getWeatherBundle } = require("../services/weatherService");
const { sendDailyForecastEmail } = require("../services/emailService");

async function sendDailyForecastBatch() {
  const users = await User.find({ isActive: true });
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    try {
      const bundle = await getWeatherBundle(user.location);
      await sendDailyForecastEmail(user, bundle);
      sent += 1;
    } catch (error) {
      failed += 1;
      console.warn(`Daily forecast email failed for ${user.email}: ${error.message}`);
    }
  }

  return { sent, failed, total: users.length };
}

module.exports = {
  sendDailyForecastBatch
};
