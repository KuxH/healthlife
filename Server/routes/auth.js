const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey"

// Signup
router.post("/signup", async (req, res) => {
  console.log(" /signup route called")

  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" })

    // ✅ Automatically assign 'admin' role if email is in admin list
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    const role = adminEmails.includes(email) ? "admin" : "user"

    const user = new User({ name, email, password, role })
    await user.save()

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ✅ Login
router.post("/login", async (req, res) => {
  console.log("✅ /login route called")

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select("+password") // 👈 important
    if (!user)
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" })

    const isMatch = await user.matchPassword(password)
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" })

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
