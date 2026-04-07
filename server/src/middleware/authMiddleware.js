const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError(401, "Authentication required.");
  }

  const decoded = jwt.verify(token, env.jwtSecret);

  if (decoded.role === "admin" && decoded.sub === "env-admin") {
    req.user = {
      id: "env-admin",
      name: "Meteo Admin",
      email: env.admin.email,
      role: "admin"
    };
    return next();
  }

  const user = await User.findById(decoded.sub).select("-password");
  if (!user || !user.isActive) {
    throw new AppError(401, "User session is no longer valid.");
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location
  };
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have access to this resource."));
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
