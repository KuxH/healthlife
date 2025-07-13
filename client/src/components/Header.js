import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, logout, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLinkClick = () => setIsMobileMenuOpen(false)

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  return (
    <header className="fixed w-full bg-white shadow-md z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo1.jpeg"
            alt="HealthLine Nepal Logo"
            className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
          />
          <span className="text-2xl font-bold text-blue-600 hidden md:inline-block">
            HealthLine Nepal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {["/", "/services", "/about", "/contact", "/doctors"].map((path) => (
            <Link
              key={path}
              to={path}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {path === "/"
                ? "Home"
                : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              to="/book-appointment"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Appointment
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              to="/auth"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login / Sign Up
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src="/default-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">{user?.name || "User"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-4">
          {["/", "/services", "/about", "/contact", "/doctors"].map((path) => (
            <Link
              key={path}
              to={path}
              onClick={handleLinkClick}
              className="block py-2 border-b"
            >
              {path === "/"
                ? "Home"
                : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link
                to="/book-appointment"
                className="block py-2 border-b text-blue-600"
                onClick={handleLinkClick}
              >
                Book Appointment
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  handleLinkClick()
                }}
                className="block py-2 border-b text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={handleLinkClick}
              className="block py-2 border-b text-blue-600"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
