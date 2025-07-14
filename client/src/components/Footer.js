import { FaFacebook, FaArrowUp } from "react-icons/fa"
import { useEffect, useState } from "react"

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-blue-700 text-white text-center py-2 text-xs">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 transition"
          title="Scroll to top"
        >
          <FaArrowUp size={12} />
        </button>
      )}

      {/* Footer content */}
      <div className="space-y-1">
        <p className="text-[11px]">
          © 2025 HealthLine Nepal. All rights reserved.
        </p>

        {/* Contact Info */}
        <div className="flex justify-center flex-wrap items-center gap-3 text-[12px]">
          <a
            href="tel:9811557810"
            className="hover:text-blue-300 transition"
            title="Call us"
          >
            📞 9811557810
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="tel:9863656937"
            className="hover:text-blue-300 transition"
            title="Call us"
          >
            📞 9863656937
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Baneshwor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            title="View location"
          >
            📍 Tikathali,Lalitpur
          </a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-2 text-sm mt-1">
          <a
            href="https://www.facebook.com/profile.php?id=61576610407286"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            title="Facebook"
          >
            <FaFacebook size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
