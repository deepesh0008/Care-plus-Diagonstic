module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      msg: Object.values(err.errors).map(error => error.message).join(", ")
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({ msg: "This record already exists" });
  }

  res.status(status).json({
    msg: status === 500 ? "Something went wrong" : err.message
  });
};
