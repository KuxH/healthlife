const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)

const contactRoutes = require("./routes/contact")
app.use("/api/contact", contactRoutes)

const appointmentRoutes = require("./routes/appointments")
app.use("/api/appointments", appointmentRoutes)

const doctorsRoutes = require("./routes/doctors")
app.use("/api/doctors", doctorsRoutes)

const adminDoctorRoutes = require("./routes/admin/doctors")
app.use("/api/admin/doctors", adminDoctorRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map((val) => val.message),
    })
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Duplicate field value entered",
    })
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Not authorized",
    })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  })
})

// Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
})
