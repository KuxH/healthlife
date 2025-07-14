import React from "react"
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex flex-col gap-4">
        <Link
          to="/admin/add-doctor"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Doctor
        </Link>
        <Link
          to="/admin/doctors"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📋 View All Doctors
        </Link>
      </div>
    </div>
  )
}
