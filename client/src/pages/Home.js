import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Home() {
  const { isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleBookClick = () => {
    if (isLoggedIn) {
      navigate("/book-appointment")
    } else {
      navigate("/login")
    }
  }

  return (
    <section className="animate-fadeIn px-6 py-20 text-center">
      <h2 className="text-4xl font-bold mb-4 text-blue-900">
        Your Health, Our Priority
      </h2>
      <p className="text-gray-700 mb-6 text-lg">
        Professional care with compassion and commitment.
      </p>

      <button
        onClick={handleBookClick}
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded transition duration-300"
      >
        Book Appointment
      </button>

      {!isLoggedIn && (
        <p className="text-red-600 font-semibold mt-4">
          Please{" "}
          <Link to="/login" className="underline text-blue-700">
            log in
          </Link>{" "}
          to book an appointment.
        </p>
      )}
    </section>
  )
}

export default Home
