const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const { requireFields } = require("../utils/validators");

exports.getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ category: 1, price: 1 });
  res.json(services);
});

exports.addService = asyncHandler(async (req, res) => {
  requireFields(req.body, ["name", "description", "price", "category"]);
  const price = Number(req.body.price);

  if (!Number.isFinite(price) || price < 0) {
    const err = new Error("Service price must be valid");
    err.status = 400;
    throw err;
  }

  const service = await Service.create({ ...req.body, price });
  res.status(201).json(service);
});
