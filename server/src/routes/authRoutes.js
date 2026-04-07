const express = require("express");
const deviceFingerprint = require("../middleware/deviceMiddleware");
const { authenticate } = require("../middleware/authMiddleware");
const { registerValidation, loginValidation, register, login, me } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", deviceFingerprint, loginValidation, login);
router.get("/me", authenticate, me);

module.exports = router;
