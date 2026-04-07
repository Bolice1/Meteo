const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "1d" });
}

module.exports = { signToken };
