const router = require("express").Router();
const c = require("../controllers/paymentController");

const auth = require("../middlewares/authMiddleware");

router.post("/pay", auth, c.pay);
module.exports = router;
