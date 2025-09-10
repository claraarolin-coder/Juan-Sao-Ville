import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

export default function SlaveDashboard() {
  const [name, setName] = useState("")
  const [skills, setSkills] = useState("")
  const [status, setStatus] = useState("")
  const [victims, setVictims] = useState([])
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")

  
  useEffect(() => {
    if (!token) return
    fetch("https://juan-sao-ville.onrender.com/victims", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setVictims)
      .catch(() => setError("⚠️ Impossible to load the victims"))
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch("https://juan-sao-ville.onrender.com/victims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, skills, status }),
      })

      if (!response.ok) {
        setError("❌ Error when adding a victim")
        return
      }

      const newVictim = await response.json()
      setVictims([...victims, newVictim]) 
      setName("")
      setSkills("")
      setStatus("")
    } catch (err) {
      console.error(err)
      setError("⚠️ Impossible to contact the servor")
    }
  }

  return (
    <div>
      {/* 🔹 Navbar */}
      <Navbar role="slave" />

      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔗  Slave's Dashboard</h1>

        {/* Formulaire d’ajout */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-gray-100 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold">🎯 Capture a victim</h2>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Statut"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ Add
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* List of Victims */}
        <h2 className="text-xl font-semibold mb-4">📋 My Victims</h2>
        <ul className="space-y-2">
          {victims.map((v) => (
            <li
              key={v.id}
              className="p-3 bg-white rounded shadow flex justify-between"
            >
              <span>
                {v.name} ({v.skills})
              </span>
              <span className="italic">{v.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
