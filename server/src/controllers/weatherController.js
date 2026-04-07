const asyncHandler = require("../utils/asyncHandler");
const { getCurrentWeather, getForecast } = require("../services/weatherService");
const { resolveLocationInput } = require("../utils/location");

function pickLocation(req) {
  return resolveLocationInput(
    {
      city: req.query.city,
      lat: req.query.lat,
      lon: req.query.lon
    },
    req.user?.location
  );
}

const getCurrent = asyncHandler(async (req, res) => {
  const weather = await getCurrentWeather(pickLocation(req));
  res.json(weather);
});

const getForecastData = asyncHandler(async (req, res) => {
  const forecast = await getForecast(pickLocation(req));
  res.json(forecast);
});

module.exports = {
  getCurrent,
  getForecastData
};
