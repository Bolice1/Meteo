const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getCurrent, getForecastData } = require("../controllers/weatherController");

const router = express.Router();

router.use(authenticate);
router.get("/current", getCurrent);
router.get("/forecast", getForecastData);

module.exports = router;
