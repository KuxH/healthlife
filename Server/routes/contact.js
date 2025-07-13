const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body

    //  validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      })
    }

    const newContact = new Contact({ name, email, message })
    await newContact.save()

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (err) {
    console.error("Error in contact form:", err)
    res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    })
  }
})

module.exports = router
