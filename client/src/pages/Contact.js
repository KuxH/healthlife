import { useState } from "react"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    location: "",
    message: "",
  })
  const [status, setStatus] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { name, contactNumber, location, message } = formData

    if (!name || !contactNumber || !message) {
      setStatus("Please fill all required fields.")
      return
    }

    const whatsappMessage = `Hello! I'd like to contact the clinic.

Name: ${name}
Contact Number: ${contactNumber}
Location: ${location}
Message: ${message}`

    const whatsappNumber = ""
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`

    window.open(whatsappURL, "_blank")

    setFormData({ name: "", contactNumber: "", location: "", message: "" })
    setStatus("")
    setShowSuccess(true)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Contact Our Clinic
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Map & Info Section */}
          <div className="space-y-6">
            <div className="text-lg space-y-2">
              <p>
                📞{" "}
                <a
                  href="tel:9811557810"
                  className="text-blue-600 hover:underline"
                >
                  9811557810
                </a>{" "}
                ,{" "}
                <a
                  href="tel:9863656937"
                  className="text-blue-600 hover:underline"
                >
                  9863656937
                </a>
              </p>
              <p>
                📍{" "}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Baneshwor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Tikathali,Lalitpur
                </a>
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn flex flex-col gap-5">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="contactNumber"
                type="tel"
                placeholder="Your Contact Number"
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
              <input
                name="location"
                type="text"
                placeholder="Your Location"
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button
                type="submit"
                className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                Send via WhatsApp
              </button>

              {status && (
                <p className="text-center text-sm text-red-600">{status}</p>
              )}

              {showSuccess && (
                <div className="flex items-center justify-center mt-4 animate-fadeIn">
                  <div className="text-green-600 text-lg font-semibold flex items-center gap-2">
                    <svg
                      className="w-6 h-6 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Message Sent Successfully!
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
