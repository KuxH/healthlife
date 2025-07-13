const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey"

// Middleware: check if user is authenticated
const protect = (req, res, next) => {
  let token = req.headers.authorization

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, no token" })
  }

  token = token.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // contains id, name, email, role
    next()
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, token failed" })
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
