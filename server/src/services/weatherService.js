const axios = require("axios");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { hasCoordinates } = require("../utils/location");

const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000
});

function buildParams(location) {
  if (hasCoordinates(location)) {
    return {
      lat: location.lat,
      lon: location.lon
    };
  }

  if (location.city) {
    return {
      q: location.city
    };
  }

  throw new AppError(400, "A city or latitude/longitude location is required.");
}

function normalizeCurrentWeather(data) {
  return {
    city: data.name,
    temperature: Number(data.main.temp.toFixed(1)),
    feelsLike: Number(data.main.feels_like.toFixed(1)),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0]?.description || "Unavailable",
    condition: data.weather[0]?.main || "Unknown",
    icon: data.weather[0]?.icon || ""
  };
}

function normalizeForecast(data) {
  return data.list.map((item) => ({
    time: item.dt_txt,
    temperature: Number(item.main.temp.toFixed(1)),
    humidity: item.main.humidity,
    description: item.weather[0]?.description || "Unavailable",
    condition: item.weather[0]?.main || "Unknown",
    icon: item.weather[0]?.icon || ""
  }));
}

function buildWarning(current, forecast = []) {
  const conditions = [current.condition, ...forecast.slice(0, 8).map((entry) => entry.condition)].join(" ").toLowerCase();
  if (conditions.includes("thunderstorm")) {
    return "Storm risk detected. Stay alert for lightning and heavy rain.";
  }
  if (conditions.includes("rain")) {
    return "Rain is expected. Consider carrying an umbrella and planning travel carefully.";
  }
  if (current.temperature >= 30) {
    return "High heat detected. Stay hydrated and avoid peak sun exposure.";
  }
  return "No severe warnings at the moment. Conditions look generally stable.";
}

async function getCurrentWeather(location) {
  const params = {
    ...buildParams(location),
    appid: env.openWeatherApiKey,
    units: "metric"
  };

  const { data } = await weatherClient.get("/weather", { params });
  return normalizeCurrentWeather(data);
}

async function getForecast(location) {
  const params = {
    ...buildParams(location),
    appid: env.openWeatherApiKey,
    units: "metric"
  };

  const { data } = await weatherClient.get("/forecast", { params });
  const items = normalizeForecast(data);

  return {
    city: data.city?.name || location.city || "Unknown",
    items,
    tomorrow: items.find((item) => item.time.includes("12:00:00")) || items[0] || null
  };
}

async function getWeatherBundle(location) {
  const [current, forecast] = await Promise.all([getCurrentWeather(location), getForecast(location)]);

  return {
    city: forecast.city || current.city,
    current,
    forecast: forecast.items,
    tomorrow: forecast.tomorrow,
    warning: buildWarning(current, forecast.items)
  };
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getWeatherBundle,
  buildWarning
};
