require("./config/env");

const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");
const startScheduler = require("./jobs/scheduler");

async function bootstrap() {
  await connectDatabase();
  startScheduler();

  app.listen(env.port, () => {
    console.log(`Meteo API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
