const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator") // For more robust email validation

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v) // More robust validation
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
      index: true, // Additional index declaration
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true, // Additional index declaration
    },

    active: {
      type: Boolean,
      default: true,
      select: false, // Hide from queries by default
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 30000,
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  }
)

// Password hash middleware with improved security
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    // Hash the password with cost factor of 12 (more secure than 10)
    this.password = await bcrypt.hash(this.password, 12)

    next()
  } catch (err) {
    next(err)
  }
})

// Method to check if password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Query middleware to filter out inactive users by default
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ role: 1 })
userSchema.index({ active: 1 })

const User = mongoose.models.User || mongoose.model("User", userSchema)

module.exports = User
