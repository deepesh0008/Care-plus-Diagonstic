const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  serviceName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  issue: { type: String, trim: true },
  appointmentDate: { type: Date, required: true, default: Date.now },
  address: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: {
  type: String,
  enum: ["Pending", "Paid", "Approved", "Completed", "Cancelled"],
  default: "Pending"
  },
  paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Refunded"], default: "Unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
