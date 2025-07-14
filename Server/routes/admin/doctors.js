const express = require("express")
const router = express.Router()
const Doctor = require("../../models/doctor")

const { protect, isAdmin } = require("../../middleware/auth")

router.use(protect, isAdmin) // protect all admin routes
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

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
router.post("/", upload.single("photo"), async (req, res) => {
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

  const photo = req.file ? `/uploads/${req.file.filename}` : ""

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
      photo,
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
