const jwt = require("jsonwebtoken")
const User = require("../models/user") // Optional: if you want to fetch full user info
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey"

// Middleware: check if user is authenticated
const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, JWT_SECRET)

      // Optional: Fetch full user if needed
      req.user = decoded
      // req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (err) {
      console.error("Token verification failed:", err.message)
      return res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed" })
    }
  } else {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, no token" })
  }
}

// Middleware: check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      error: "Access denied: Admins only",
    })
  }
}

module.exports = {
  protect,
  isAdmin,
}
