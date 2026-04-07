const { body } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const { registerUser, loginUser } = require("../services/authService");
const { getCurrentWeather, getWeatherBundle } = require("../services/weatherService");
const { sendWelcomeEmail, sendSecurityAlertEmail } = require("../services/emailService");
const { resolveLocationInput } = require("../utils/location");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  body("city").optional({ nullable: true }).isString().withMessage("City must be text."),
  body("lat").optional({ nullable: true }).isFloat({ min: -90, max: 90 }).withMessage("Latitude must be valid."),
  body("lon").optional({ nullable: true }).isFloat({ min: -180, max: 180 }).withMessage("Longitude must be valid."),
  validateRequest
];

const loginValidation = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
  validateRequest
];

const register = asyncHandler(async (req, res) => {
  const location = resolveLocationInput(req.body);
  const user = await registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    location
  });

  let preview = null;
  try {
    preview = await getCurrentWeather(location);
  } catch (error) {
    console.warn("Weather preview failed during signup:", error.message);
  }

  try {
    await sendWelcomeEmail(user, preview);
  } catch (error) {
    console.warn("Welcome email failed:", error.message);
  }

  res.status(201).json({
    message: "Registration successful. Welcome email sent if mail transport is configured."
  });
});

const login = asyncHandler(async (req, res) => {
  const authResult = await loginUser({
    email: req.body.email,
    password: req.body.password,
    ip: req.deviceInfo.ip,
    device: req.deviceInfo.device
  });

  if (authResult.unusualLogin && authResult.user.email) {
    try {
      await sendSecurityAlertEmail(authResult.user, {
        time: new Date().toLocaleString("en-US", { timeZone: "Africa/Kigali" }),
        ip: req.deviceInfo.ip,
        device: req.deviceInfo.device
      });
    } catch (error) {
      console.warn("Security alert email failed:", error.message);
    }
  }

  let weatherBundle = null;
  if (authResult.user.role === "user") {
    try {
      weatherBundle = await getWeatherBundle(authResult.user.location);
    } catch (error) {
      console.warn("Weather load failed during login:", error.message);
    }
  }

  res.json({
    message: "Login successful.",
    token: authResult.token,
    user: authResult.user.role === "admin"
      ? authResult.user
      : {
          id: authResult.user._id,
          name: authResult.user.name,
          email: authResult.user.email,
          role: authResult.user.role,
          location: authResult.user.location
        },
    unusualLogin: authResult.unusualLogin,
    weather: weatherBundle
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = {
  registerValidation,
  loginValidation,
  register,
  login,
  me
};
