import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let url = "http://localhost:5000/api/doctors"
        const params = new URLSearchParams()
        if (searchTerm) params.append("search", searchTerm)
        if (specializationFilter)
          params.append("specialization", specializationFilter)

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        const data = await response.json()
        if (response.ok) {
          setDoctors(data.data)
        } else {
          setError(data.error || "Failed to fetch doctors")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [searchTerm, specializationFilter])

  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Doctors</h1>

      {/* Search & Filter */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Doctors
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or specialty"
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Specialty
          </label>
          <select
            id="specialization"
            className="w-full p-2 border rounded"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No doctors found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSpecializationFilter("")
            }}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {doctor.photo ? (
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border"
                    />
                  ) : (
                    <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-4">
                      {doctor.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {doctor.name}
                    </h2>
                    <p className="text-blue-600">{doctor.designation}</p>
                    <p className="text-sm text-gray-500">
                      NMC No: {doctor.nmcNumber}
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Specialization:</h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Qualifications:</h3>
                  <p className="text-gray-600">{doctor.qualifications}</p>
                </div>

                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Experience:</h3>
                  <p className="text-gray-600">
                    {doctor.expYear} year{doctor.expYear > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700">Availability:</h3>
                  <ul className="text-gray-600">
                    {doctor.availability?.days
                      ?.slice(0, 3)
                      .map((day, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{day}:</span>
                          <span>{doctor.availability.hours}</span>
                        </li>
                      ))}
                    {doctor.availability?.days?.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{doctor.availability.days.length - 3} more days
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Link
                    to={`/book-appointment?doctor=${doctor._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                  >
                    Book Appointment
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Doctors
