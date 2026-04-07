const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "OPENWEATHER_API_KEY",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD"
];

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  console.warn(`Missing environment variables: ${missingVars.join(", ")}`);
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  cron: {
    time: process.env.CRON_TIME || "0 7 * * *",
    timezone: process.env.CRON_TIMEZONE || "Africa/Kigali"
  }
};
