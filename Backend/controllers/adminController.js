const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllAppointments = asyncHandler(async (req, res) => {
  const data = await Appointment.find()
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });
  res.json(data);
});

exports.updateAppointment = asyncHandler(async (req, res) => {
  const allowed = ["Pending", "Paid", "Approved", "Completed", "Cancelled"];
  const update = {};

  if (req.body.status) {
    if (!allowed.includes(req.body.status)) {
      const err = new Error("Invalid appointment status");
      err.status = 400;
      throw err;
    }
    update.status = req.body.status;
  }

  if (req.body.notes !== undefined) update.notes = req.body.notes;

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!appointment) {
    const err = new Error("Appointment not found");
    err.status = 404;
    throw err;
  }

  res.json({ msg: "Appointment updated", appointment });
});
