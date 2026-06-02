const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const {
  assertEmail,
  assertPassword,
  assertPhone,
  normalizeEmail,
  requireFields
} = require("../utils/validators");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET || "CHANGE_ME_LOCAL_SECRET",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

exports.register = asyncHandler(async (req, res) => {
  const { name, password, phone } = req.body;
  const email = normalizeEmail(req.body.email);

  requireFields({ name, email, password, phone }, ["name", "email", "password", "phone"]);
  assertEmail(email);
  assertPhone(phone);
  assertPassword(password);

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const user = await User.create({
    name: name.trim(),
    email,
    phone: phone.trim(),
    password: await bcrypt.hash(password, 10)
  });

  res.status(201).json({
    msg: "Registered successfully",
    user: publicUser(user)
  });
});

exports.login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  requireFields({ email, password }, ["email", "password"]);
  assertEmail(email);

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 400;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email or password");
    err.status = 400;
    throw err;
  }

  res.json({
    token: signToken(user),
    role: user.role,
    user: publicUser(user)
  });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  res.json({ user: publicUser(user) });
});
