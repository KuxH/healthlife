import React, { useContext } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Services from "./pages/Services"
// import Appointment from "./pages/Appointment"
import Contact from "./pages/Contact"
import Doctors from "./pages/Doctors"
import AuthPage from "./pages/AuthPage"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AddDoctorPage from "./pages/admin/AddDoctorPage"
import DoctorsListPage from "./pages/admin/DoctorsListPage"

import ProtectedRoute from "./context/ProtectedRoute"
import AdminRoute from "./context/AdminRoute"
import { AuthContext } from "./context/AuthContext"

import "./index.css"

function App() {
  const { user } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow max-w-6xl mx-auto px-6 pt-24 pb-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected user route */}
            {/* <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            /> */}

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/add-doctor"
              element={
                <AdminRoute>
                  <AddDoctorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <AdminRoute>
                  <DoctorsListPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
