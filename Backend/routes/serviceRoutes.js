const router = require("express").Router();
const c = require("../controllers/serviceController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.get("/", c.getServices);
router.post("/", auth, role("admin"), c.addService);

module.exports = router;
