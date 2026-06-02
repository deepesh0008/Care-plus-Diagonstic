const router = require("express").Router();
const c = require("../controllers/appointmentController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, c.createAppointment);
router.get("/my", auth, c.myAppointments);
router.put("/:id/cancel", auth, c.cancelAppointment);

module.exports = router;
