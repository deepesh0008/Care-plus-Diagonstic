const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const { assertEmail, assertPhone, normalizeEmail, requireFields } = require("../utils/validators");

exports.createAppointment = asyncHandler(async (req, res) => {
  const {
    serviceName,
    issue,
    appointmentDate,
    name,
    phone,
    address,
    notes
  } = req.body;
  const email = normalizeEmail(req.body.email);
  const price = Number(req.body.price);

  requireFields({ serviceName, name, email, phone }, ["serviceName", "name", "email", "phone"]);
  assertEmail(email);
  assertPhone(phone);

  if (!Number.isFinite(price) || price <= 0) {
    const err = new Error("Please select a valid service price");
    err.status = 400;
    throw err;
  }

  const selectedDate = appointmentDate ? new Date(appointmentDate) : new Date();
  if (Number.isNaN(selectedDate.getTime())) {
    const err = new Error("Please select a valid appointment date");
    err.status = 400;
    throw err;
  }

  const service = await Service.findOne({ name: serviceName, isActive: true });
  const finalPrice = service ? service.price : price;

  const appt = await Appointment.create({
    serviceName,
    price: finalPrice,
    issue: issue || serviceName,
    appointmentDate: selectedDate,
    name: name.trim(),
    email,
    phone: phone.trim(),
    address,
    notes,
    userId: req.user.id
  });

  res.status(201).json(appt);
});

exports.myAppointments = asyncHandler(async (req, res) => {
  const data = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(data);
});

exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user.id });
  if (!appt) {
    const err = new Error("Appointment not found");
    err.status = 404;
    throw err;
  }

  if (appt.paymentStatus === "Paid") {
    const err = new Error("Paid appointments can only be cancelled by the clinic");
    err.status = 400;
    throw err;
  }

  appt.status = "Cancelled";
  await appt.save();
  res.json({ msg: "Appointment cancelled", appointment: appt });
});
