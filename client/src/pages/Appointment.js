import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Appointment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const servicesRequiringDoctor = [
    "consultation",
    "checkup",
    "home doctor visit",
    "treatment",
  ]

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const searchParams = new URLSearchParams(location.search)
  const doctorIdFromQuery = searchParams.get("doctor") || ""

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
    doctorId: doctorIdFromQuery,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [doctorsList, setDoctorsList] = useState([])

  const showDoctorSelect = servicesRequiringDoctor.includes(formData.service)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors")
        const data = await res.json()
        console.log("Doctor data response:", data)
        if (Array.isArray(data)) {
          setDoctorsList(data)
        } else if (Array.isArray(data.doctors)) {
          setDoctorsList(data.doctors)
        } else {
          setDoctorsList([]) 
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err)
        setDoctorsList([])
      }
    }
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (!doctorIdFromQuery) return
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors/${doctorIdFromQuery}`
        )
        if (!res.ok) throw new Error("Failed to fetch doctor info")
        const data = await res.json()
        setDoctorName(data.name || "")
      } catch {
        setDoctorName("")
      }
    }
    fetchDoctor()
  }, [doctorIdFromQuery])

  const handleChange = (e) => {
    const { name, value } = e.target
    const formatted = name === "phone" ? formatPhoneNumber(value) : value

    if (name === "service" && !servicesRequiringDoctor.includes(value)) {
      setFormData({ ...formData, [name]: value, doctorId: "" })
    } else {
      setFormData({ ...formData, [name]: formatted })
    }

    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value
    const phoneNumber = value.replace(/[^\d]/g, "")
    if (phoneNumber.length < 4) return phoneNumber
    if (phoneNumber.length < 7)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email is invalid"

    const phoneDigits = formData.phone.replace(/[^\d]/g, "")
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    else if (phoneDigits.length < 10)
      newErrors.phone = "Phone must be 10 digits"

    if (!formData.service) newErrors.service = "Please select a service"
    if (!formData.date) newErrors.date = "Date is required"
    else if (
      new Date(formData.date) < new Date(new Date().setHours(0, 0, 0, 0))
    )
      newErrors.date = "Date cannot be in the past"

    if (!formData.time) newErrors.time = "Time is required"
    if (showDoctorSelect && !formData.doctorId)
      newErrors.doctorId = "Doctor selection is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/[^\d]/g, ""),
          date: new Date(formData.date).toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to book appointment")

      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        message: "",
        doctorId: doctorIdFromQuery,
      })
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Appointment Booked Successfully!
        </h2>
        <p className="text-gray-700 mb-4">
          Thank you for booking an appointment with us.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Book Another Appointment
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Book an Appointment
      </h2>

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      {doctorName && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded text-blue-800 font-semibold">
          Booking with Dr. {doctorName}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="name"
          label="Full Name *"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
        />

        <FormInput
          id="email"
          label="Email *"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john@example.com"
        />

        <FormInput
          id="phone"
          label="Phone Number *"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="(123) 456-7890"
          maxLength={14}
        />

        <div>
          <label htmlFor="service" className="block text-gray-700 mb-1">
            Service *
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.service ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a service</option>
            <option value="consultation">Consultation</option>
            <option value="checkup">Regular Checkup</option>
            <option value="home doctor visit">Home Doctor Visit</option>
            <option value="treatment">Treatment</option>
            <option value="delivery">Pharmacy Delivery</option>
            <option value="blood">Blood Sample Collection</option>
            <option value="nursing">Nursing & Home Care</option>
          </select>
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service}</p>
          )}
        </div>

        {showDoctorSelect && (
          <div>
            <label htmlFor="doctorId" className="block text-gray-700 mb-1">
              Select Doctor *
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.doctorId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Choose a doctor</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} - {doc.specialization}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="date"
            label="Date *"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            min={new Date().toISOString().split("T")[0]}
          />
          <div>
            <label htmlFor="time" className="block text-gray-700 mb-1">
              Time *
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.time ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select time</option>
              {[...Array(24).keys()].map((h) =>
                ["00", "15", "30", "45"].map((m) => {
                  const time = `${String(h).padStart(2, "0")}:${m}`
                  return (
                    <option key={time} value={time}>
                      {new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  )
                })
              )}
            </select>
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 mb-1">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            placeholder="Any special requests or notes..."
          />
        </div>

        <input type="hidden" name="doctorId" value={formData.doctorId} />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded text-white ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  )
}

const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  ...rest
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...rest}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export default Appointment
