const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  preparation: { type: String, default: "No special preparation required" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
