import { useState, useEffect } from "react"

export default function SlaveDashboard() {
  const [victims, setVictims] = useState([])
  const [rewards, setRewards] = useState([])
  const [newVictim, setNewVictim] = useState({ name: "", skills: "", status: "" })
  const [slaveId, setSlaveId] = useState(null)
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return
    fetch("http://localhost:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => setSlaveId(user.id))
      .catch(() => setError("❌ Error when getting user"))
  }, [token])

  useEffect(() => {
    if (!token || !slaveId) return

    fetch("http://localhost:8000/victims", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const myVictims = data.filter((v) => v.slave_id === slaveId)
        setVictims(myVictims)
      })
      .catch(() => setError("❌ Error when loading victims"))

    fetch(`http://localhost:8000/rewards/slave/${slaveId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRewards)
      .catch(() => setError("❌ Error when loading rewards "))
  }, [token, slaveId])

  const handleAddVictim = async (e) => {
    e.preventDefault()
    if (!slaveId) return

    try {
      const res = await fetch("http://localhost:8000/victims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newVictim, slave_id: slaveId }),
      })

      if (!res.ok) throw new Error("Error API")

      const victim = await res.json()
      setVictims([...victims, victim])
      setNewVictim({ name: "", skills: "", status: "" })
    } catch (err) {
      console.error(err)
      setError("⚠️ Impossible to add the victim")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔗  Slave's Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Formulaire ajout victime */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">➕ Add a victim</h2>
        <form onSubmit={handleAddVictim} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={newVictim.name}
            onChange={(e) => setNewVictim({ ...newVictim, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Skills"
            value={newVictim.skills}
            onChange={(e) => setNewVictim({ ...newVictim, skills: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Statut (captured, transformed, ...)"
            value={newVictim.status}
            onChange={(e) => setNewVictim({ ...newVictim, status: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </section>

      {/* My victims */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🧑‍💻 My Victims</h2>
        <ul className="space-y-2">
          {victims.map((v) => (
            <li key={v.id} className="p-3 bg-gray-100 rounded shadow flex justify-between">
              <span>{v.name} ({v.skills})</span>
              <span className="italic">{v.status}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* My rewards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎁 My Rewards</h2>
        <ul className="space-y-2">
          {rewards.map((r) => (
            <li key={r.id} className="p-3 bg-green-100 rounded shadow">
              <strong>{r.title}</strong> — {r.points} points
              <p className="text-sm">{r.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
