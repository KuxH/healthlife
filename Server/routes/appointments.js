const express = require("express")
const router = express.Router()
const Appointment = require("../models/appointment")

// POST /api/appointments
router.post("/", async (req, res) => {
  try {
    // number only in phone
    if (req.body.phone) {
      req.body.phone = req.body.phone.replace(/[^\d]/g, "")
    }

    const appointment = new Appointment(req.body)
    await appointment.save()

    res.status(201).json({
      success: true,
      data: appointment,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Invalid appointment data",
    })
  }
})

// GET /api/appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name specialization")
      .sort({ date: 1 })

    res.status(200).json({
      success: true,
      data: appointments,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
})

// PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: appointment,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Invalid update request",
    })
  }
})

module.exports = router
