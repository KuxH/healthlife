import { useEffect, useState } from "react"

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchDoctors = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/admin/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch")
      setDoctors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this doctor?"
    )
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/admin/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Delete failed")
      alert("Doctor deleted")
      fetchDoctors()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading doctors...</div>
    )
  }

  if (error) {
    return <div className="text-red-600 text-center mt-6">{error}</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">All Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Photo</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Specialization</th>
                <th className="border px-3 py-2">NMC No.</th>
                <th className="border px-3 py-2">Experience</th>
                <th className="border px-3 py-2">Contact</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id}>
                  <td className="border px-3 py-2 text-center">
                    {doc.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/doctors/${doc.photo}`}
                        alt={doc.name}
                        className="h-12 w-12 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border px-3 py-2">{doc.name}</td>
                  <td className="border px-3 py-2">{doc.specialization}</td>
                  <td className="border px-3 py-2">{doc.nmcNumber}</td>
                  <td className="border px-3 py-2">
                    {doc.experience || "N/A"}
                  </td>
                  <td className="border px-3 py-2">{doc.contact}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
