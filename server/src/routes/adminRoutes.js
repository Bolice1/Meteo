const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { getUsers, disableUser, getLogs, getStats, broadcast } = require("../controllers/adminController");

const router = express.Router();

router.use(authenticate, authorize("admin"));
router.get("/users", getUsers);
router.get("/logs", getLogs);
router.get("/stats", getStats);
router.delete("/user/:id", disableUser);
router.post("/broadcast", broadcast);

module.exports = router;
