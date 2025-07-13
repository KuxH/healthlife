import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // On app load, check if token exists
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      // Fetch user data from API
      setUser({ name: "User" })
    }
  }, [])

  // login : save token and update state
  function login(token, userData) {
    localStorage.setItem("token", token)
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
