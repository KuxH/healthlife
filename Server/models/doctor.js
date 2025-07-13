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
    reviews: [
      {
        patientName: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

doctorSchema.index({
  name: "text",
  specialization: "text",
  qualifications: "text",
})

doctorSchema.virtual("averageRating").get(function () {
  if (this.reviews?.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0)
    return Math.round((total / this.reviews.length) * 10) / 10
  }
  return 0
})

module.exports = mongoose.model("Doctor", doctorSchema)
