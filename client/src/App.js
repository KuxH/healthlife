import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Services from "./pages/Services"
import Appointment from "./pages/Appointment"
import Contact from "./pages/Contact"
import Doctors from "./pages/Doctors"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
import ProtectedRoute from "./context/ProtectedRoute"
import AuthPage from "./pages/AuthPage"

import "./index.css"

function App() {
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
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
