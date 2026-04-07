const cron = require("node-cron");
const env = require("../config/env");
const { sendDailyForecastBatch } = require("./dailyForecastJob");

function startScheduler() {
  cron.schedule(
    env.cron.time,
    async () => {
      console.log("Running Meteo daily forecast cron");
      await sendDailyForecastBatch();
    },
    {
      timezone: env.cron.timezone
    }
  );
}

module.exports = startScheduler;
