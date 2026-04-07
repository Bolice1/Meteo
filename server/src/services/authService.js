const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/token");
const env = require("../config/env");

async function registerUser({ name, email, password, location }) {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    location
  });

  return user;
}

async function loginUser({ email, password, ip, device }) {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail === env.admin.email?.toLowerCase()) {
    if (password !== env.admin.password) {
      await LoginLog.create({
        actorType: "admin",
        email: normalizedEmail,
        ip,
        device,
        unusual: false,
        success: false
      });
      throw new AppError(401, "Invalid credentials.");
    }

    await LoginLog.create({
      actorType: "admin",
      email: normalizedEmail,
      ip,
      device,
      unusual: false,
      success: true
    });

    const token = signToken({
      sub: "env-admin",
      email: normalizedEmail,
      role: "admin"
    });

    return {
      token,
      user: {
        id: "env-admin",
        name: "Meteo Admin",
        email: normalizedEmail,
        role: "admin"
      },
      unusualLogin: false
    };
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  if (!user.isActive) {
    throw new AppError(403, "This account has been disabled.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    await LoginLog.create({
      actorType: "user",
      user: user._id,
      email: normalizedEmail,
      ip,
      device,
      unusual: false,
      success: false
    });
    throw new AppError(401, "Invalid credentials.");
  }

  const seenIp = user.loginHistory.some((entry) => entry.ip === ip);
  const seenDevice = user.loginHistory.some((entry) => entry.device === device);
  const unusualLogin = Boolean(user.lastLoginIP && user.lastLoginDevice) && (!seenIp || !seenDevice);

  user.lastLoginIP = ip;
  user.lastLoginDevice = device;
  user.loginHistory.unshift({
    ip,
    device,
    unusual: unusualLogin
  });
  user.loginHistory = user.loginHistory.slice(0, 20);
  await user.save();

  await LoginLog.create({
    actorType: "user",
    user: user._id,
    email: user.email,
    ip,
    device,
    unusual: unusualLogin,
    success: true
  });

  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    token,
    user,
    unusualLogin
  };
}

module.exports = {
  registerUser,
  loginUser
};
