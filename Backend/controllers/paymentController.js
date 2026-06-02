const crypto = require("crypto");
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

exports.pay = asyncHandler(async (req, res) => {
  const { appointmentId, method } = req.body;
  const amount = Number(req.body.amount);

  if (!appointmentId || !Number.isFinite(amount) || amount <= 0 || !method) {
    const err = new Error("Payment details are required");
    err.status = 400;
    throw err;
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, userId: req.user.id });
  if (!appointment) {
    const err = new Error("Appointment not found");
    err.status = 404;
    throw err;
  }

  if (appointment.paymentStatus === "Paid") {
    return res.json({ msg: "Payment already completed" });
  }

  const payment = await Payment.create({
    appointmentId,
    amount,
    method,
    status: "Paid",
    transactionId: `CP-${crypto.randomBytes(5).toString("hex").toUpperCase()}`
  });

  appointment.paymentStatus = "Paid";
  appointment.status = "Paid";
  await appointment.save();

  res.json({ msg: "Payment successful", payment });
});
