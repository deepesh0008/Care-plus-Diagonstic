const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Service = require("./models/Service");
const bcrypt = require("bcryptjs");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map(origin => origin.trim());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));

const frontendPath = path.join(__dirname, "..", "Frontend");
app.use("/css", express.static(path.join(frontendPath, "css")));
app.use("/js", express.static(path.join(frontendPath, "js")));
app.use("/images", express.static(path.join(frontendPath, "html")));
app.use(express.static(path.join(frontendPath, "html")));

async function seedDemoData() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@careplus.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      name: "CarePlus Admin",
      email: adminEmail,
      phone: "9876543210",
      password: await bcrypt.hash(adminPassword, 10),
      role: "admin"
    });
    console.log(`Demo admin created: ${adminEmail} / ${adminPassword}`);
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { name: "CBC Blood Test", description: "Complete blood count", price: 400, category: "Blood Test" },
      { name: "Lipid Profile", description: "Cholesterol and triglyceride screening", price: 800, category: "Blood Test", preparation: "8-10 hours fasting" },
      { name: "MRI Scan", description: "Detailed imaging diagnostics", price: 4500, category: "Imaging", preparation: "Doctor prescription required" },
      { name: "CT Scan", description: "Cross-sectional imaging study", price: 3500, category: "Imaging", preparation: "Doctor prescription required" },
      { name: "Diabetes Package", description: "FBS, PP and HbA1c", price: 999, category: "Package", preparation: "8 hours fasting" }
    ]);
  }
}

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CarePlus API", time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html", "index.html"));
});

app.use(errorMiddleware);

// Create HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedDemoData)
  .then(() => {
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the old server or set PORT to another value.`);
        process.exit(1);
      }
      throw err;
    });

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
