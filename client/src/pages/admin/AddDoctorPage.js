import { useState } from "react"

export default function AddDoctorPage() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualifications: "",
    experience: "",
    nmcNumber: "",
    bio: "",
    contact: "",
    availabilityDays: "",
    availabilityHours: "",
    photo: null,
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    const token = localStorage.getItem("token") // get JWT from localStorage

    const data = new FormData()
    for (let key in formData) {
      if (key === "availabilityDays") {
        data.append("availability[days]", formData.availabilityDays.split(","))
      } else if (key === "availabilityHours") {
        data.append("availability[hours]", formData.availabilityHours)
      } else {
        data.append(key, formData[key])
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/doctors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Something went wrong")

      setMessage("Doctor created successfully!")
      setFormData({
        name: "",
        specialization: "",
        qualifications: "",
        experience: "",
        nmcNumber: "",
        bio: "",
        contact: "",
        availabilityDays: "",
        availabilityHours: "",
        photo: null,
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add New Doctor</h2>

      {message && <div className="text-green-600 mb-3">{message}</div>}
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="qualifications"
          placeholder="Qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="nmcNumber"
          placeholder="NMC Number"
          value={formData.nmcNumber}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="availabilityDays"
          placeholder="Available Days (comma separated)"
          value={formData.availabilityDays}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="availabilityHours"
          placeholder="Available Hours (e.g. 9AM - 5PM)"
          value={formData.availabilityHours}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Doctor
        </button>
      </form>
    </div>
  )
}
