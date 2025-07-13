import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext)

  if (!isLoggedIn) {
    // Redirect to login page if user is not logged in
    return <Navigate to="/login" replace />
  }

  // If logged in, render the child component(s)
  return children
}

export default ProtectedRoute
