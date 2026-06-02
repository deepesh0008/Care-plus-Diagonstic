const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "Please login to continue" });

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || "CHANGE_ME_LOCAL_SECRET");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Session expired. Please login again" });
  }
};
