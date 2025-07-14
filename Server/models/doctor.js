const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    qualifications: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },
    nmcNumber: { type: String, required: true, unique: true, trim: true },
    bio: { type: String, trim: true },
    contact: {
      type: String,
      trim: true,
      match: [/^[\d+()\-\s]*$/, "Invalid contact number format"],
    },
    availability: {
      days: {
        type: [String],
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      hours: {
        type: String,
        required: true,
        default: "9:00 AM - 5:00 PM",
        trim: true,
      },
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

doctorSchema.index({
  name: "text",
  specialization: "text",
  qualifications: "text",
})

module.exports = mongoose.model("Doctor", doctorSchema)
