const router = require("express").Router();
const c = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.get("/appointments", auth, role("admin"), c.getAllAppointments);
router.put("/appointment/:id", auth, role("admin"), c.updateAppointment);

module.exports = router;
