const express = require("express")
const router = express.Router()
const Doctor = require("../../models/doctor")

const { protect, isAdmin } = require("../../middleware/auth")

router.use(protect, isAdmin) // protect all admin routes

// GET all doctors (admin)
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({})
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new doctor (admin)
router.post("/", async (req, res) => {
  const {
    name,
    specialization,
    qualifications,
    experience,
    nmcNumber,
    bio,
    contact,
    availability,
  } = req.body

  try {
    const existing = await Doctor.findOne({ nmcNumber })
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "NMC number already exists" })
    }

    const doctor = new Doctor({
      name,
      specialization,
      qualifications,
      experience,
      nmcNumber,
      bio,
      contact,
      availability,
    })

    await doctor.save()
    res.status(201).json({ success: true, message: "Doctor created", doctor })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE doctor by ID (admin)
router.delete("/:id", async (req, res) => {
  try {
    const doctorId = req.params.id
    await Doctor.findByIdAndDelete(doctorId)
    res.json({ success: true, message: "Doctor deleted" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
