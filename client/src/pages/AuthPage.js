import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      if (isLogin) {
        // Only login on actual login
        login(data.token, data.user)
        localStorage.setItem("role", data.user.role) // Optional, for quick access

        if (data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      } else {
        // After signup, show success and switch to login form
        alert("Signup successful! Please log in.")
        setIsLogin(true)
        setFormData({ email: "", password: "", name: "" })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  )
}
