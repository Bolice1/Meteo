const { body } = require("express-validator");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const { resolveLocationInput } = require("../utils/location");

const updateLocationValidation = [
  body("city").optional({ nullable: true }).isString().withMessage("City must be text."),
  body("lat").optional({ nullable: true }).isFloat({ min: -90, max: 90 }).withMessage("Latitude must be valid."),
  body("lon").optional({ nullable: true }).isFloat({ min: -180, max: 180 }).withMessage("Longitude must be valid."),
  validateRequest
];

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

const updateLocation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.location = resolveLocationInput(req.body, user.location);
  await user.save();

  res.json({
    message: "Location updated successfully.",
    location: user.location
  });
});

module.exports = {
  updateLocationValidation,
  getProfile,
  updateLocation
};
