function deviceFingerprint(req, _res, next) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown";
  req.deviceInfo = {
    ip,
    device: req.headers["user-agent"] || "unknown-device"
  };
  next();
}

module.exports = deviceFingerprint;
