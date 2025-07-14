import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext)

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
