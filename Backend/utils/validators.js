const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{7,15}$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function requireFields(body, fields) {
  const missing = fields.filter(field => !String(body[field] || "").trim());
  if (missing.length) {
    const err = new Error(`Missing required fields: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
}

function assertEmail(email) {
  if (!emailRegex.test(normalizeEmail(email))) {
    const err = new Error("Please enter a valid email address");
    err.status = 400;
    throw err;
  }
}

function assertPhone(phone) {
  if (!phoneRegex.test(String(phone || "").trim())) {
    const err = new Error("Please enter a valid phone number");
    err.status = 400;
    throw err;
  }
}

function assertPassword(password) {
  if (String(password || "").length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.status = 400;
    throw err;
  }
}

module.exports = {
  assertEmail,
  assertPassword,
  assertPhone,
  normalizeEmail,
  requireFields
};
