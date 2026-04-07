const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getProfile, updateLocation, updateLocationValidation } = require("../controllers/userController");

const router = express.Router();

router.use(authenticate);
router.get("/profile", getProfile);
router.put("/update-location", updateLocationValidation, updateLocation);

module.exports = router;
