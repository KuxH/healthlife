const express = require("express")
const router = express.Router()
const Doctor = require("../models/doctor")

// GET all doctors with search, filter, sort, field select
router.get("/", async (req, res) => {
  try {
    const { search, specialization, sort, fields } = req.query
    const query = {}

    if (search) {
      query.$text = { $search: search }
    }

    if (specialization) {
      query.specialization = specialization
    }

    let result = Doctor.find(query)

    // Sort: allow multiple fields comma separated
    if (sort) {
      const sortList = sort.split(",").join(" ")
      result = result.sort(sortList)
    } else {
      result = result.sort("name")
    }

    // Select specific fields
    if (fields) {
      const fieldsList = fields.split(",").join(" ")
      result = result.select(fieldsList)
    }

    const doctors = await result

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Server Error" })
  }
})

// GET doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" })
    }
    res.status(200).json({ success: true, data: doctor })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Server Error" })
  }
})

// POST create new doctor
router.post("/", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json({ success: true, data: doctor })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT update doctor by ID
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" })
    }
    res.status(200).json({ success: true, data: doctor })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE doctor by ID
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" })
    }
    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Server Error" })
  }
})

// POST add review to doctor
router.post("/:id/reviews", async (req, res) => {
  try {
    const { patientName, rating, comment } = req.body
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" })
    }
    doctor.reviews.push({ patientName, rating, comment })
    await doctor.save()
    res.status(201).json({ success: true, data: doctor.reviews })
  } catch (err) {
    console.error(err)
    res.status(400).json({ success: false, error: err.message })
  }
})

module.exports = router
