const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ["UPI", "Card", "Cash"], required: true },
  status: { type: String, enum: ["Paid", "Failed", "Refunded"], default: "Paid" },
  transactionId: String
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
