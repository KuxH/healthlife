import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // On app load, check if token exists
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData)) // ✅ properly restore user
    }
  }, [])

  // login : save token and update state
  function login(token, userData) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData)) // ✅ save user
    setIsLoggedIn(true)
    setUser(userData)
  }

  // logout: remove token and clear state
  function logout() {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
