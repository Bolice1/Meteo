const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: false,
  auth: {
    user: env.email.user,
    pass: env.email.pass
  }
});

async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: env.email.from,
    to,
    subject,
    html
  });
}

function renderWeatherPreview(weather) {
  if (!weather) {
    return "<p>Weather preview is currently unavailable.</p>";
  }

  return `
    <ul>
      <li>City: ${weather.city}</li>
      <li>Temperature: ${weather.temperature}°C</li>
      <li>Condition: ${weather.description}</li>
      <li>Humidity: ${weather.humidity}%</li>
      <li>Wind: ${weather.windSpeed} m/s</li>
    </ul>
  `;
}

async function sendWelcomeEmail(user, weatherPreview) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Meteo",
    html: `
      <h2>Welcome to Meteo, ${user.name}</h2>
      <p>Meteo helps people in Rwanda understand today's weather, tomorrow's outlook, and fast-changing conditions.</p>
      <p>Your account is ready, and we will use your saved location to deliver daily forecast intelligence.</p>
      <h3>First weather preview</h3>
      ${renderWeatherPreview(weatherPreview)}
    `
  });
}

async function sendDailyForecastEmail(user, payload) {
  return sendEmail({
    to: user.email,
    subject: "Your Meteo daily forecast",
    html: `
      <h2>Good morning, ${user.name}</h2>
      <p>Here is your daily Meteo update for ${payload.city}.</p>
      <h3>Current weather</h3>
      ${renderWeatherPreview(payload.current)}
      <h3>Tomorrow forecast</h3>
      <ul>
        <li>Expected temperature: ${payload.tomorrow.temperature}°C</li>
        <li>Condition: ${payload.tomorrow.description}</li>
        <li>Expected time: ${payload.tomorrow.time}</li>
      </ul>
      <h3>Warnings</h3>
      <p>${payload.warning}</p>
    `
  });
}

async function sendSecurityAlertEmail(user, loginInfo) {
  return sendEmail({
    to: user.email,
    subject: "Meteo security alert: unusual login detected",
    html: `
      <h2>Security alert for your Meteo account</h2>
      <p>We noticed a login from a new device or IP address.</p>
      <ul>
        <li>Time: ${loginInfo.time}</li>
        <li>IP address: ${loginInfo.ip}</li>
        <li>Device: ${loginInfo.device}</li>
      </ul>
      <p>If this was not you, reset your password immediately and review your recent activity.</p>
    `
  });
}

module.exports = {
  transporter,
  sendEmail,
  sendWelcomeEmail,
  sendDailyForecastEmail,
  sendSecurityAlertEmail
};
