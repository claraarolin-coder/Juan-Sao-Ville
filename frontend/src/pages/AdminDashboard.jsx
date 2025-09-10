import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [victims, setVictims] = useState([])
  const [rewards, setRewards] = useState([])
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    points: 0,
    slave_id: "",
  })
  const [error, setError] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        
        const resLeaderboard = await fetch("https://juan-sao-ville.onrender.com/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setLeaderboard(resLeaderboard.ok ? await resLeaderboard.json() : [])

        
        const resVictims = await fetch("https://juan-sao-ville.onrender.com/victims", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setVictims(resVictims.ok ? await resVictims.json() : [])

       
        const resRewards = await fetch("https://juan-sao-ville.onrender.com/rewards", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRewards(resRewards.ok ? await resRewards.json() : [])
      } catch (err) {
        console.error("❌ error in useEffect:", err)
        setError("Impossible to load datas")
      }
    }

    fetchData()
  }, [token])

  const handleCreateReward = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch("https://juan-sao-ville.onrender.com/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReward),
      })

      if (!res.ok) throw new Error("Error API")

      const created = await res.json()
      setRewards([...rewards, created])
      setNewReward({ title: "", description: "", points: 0, slave_id: "" })
    } catch (err) {
      console.error(err)
      setError("❌ Impossible to create rewards")
    }
  }

  return (
    <div className="p-8">
      {/* Header avec déconnexion */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">⚙️ Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700"
        >
          Log out
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Leaderboard */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🏆 Slaves' Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500">No slaves at the moment</p>
        ) : (
          <ul className="space-y-2">
            {leaderboard.map((slave, idx) => (
              <li
                key={idx}
                className="p-3 bg-gray-100 rounded shadow flex justify-between"
              >
                <span>{slave.email}</span>
                <span>{slave.victim_count} victims</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Victimes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🧑‍💻 List of Victims</h2>
        {victims.length === 0 ? (
          <p className="text-gray-500">No victims registered</p>
        ) : (
          <ul className="space-y-2">
            {victims.map((victim) => (
              <li
                key={victim.id}
                className="p-3 bg-white rounded shadow flex justify-between"
              >
                <span>
                  {victim.name} ({victim.skills})
                </span>
                <span className="italic">{victim.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Rewards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎁 Manage Rewards</h2>

        {/* Formulaire */}
        <form onSubmit={handleCreateReward} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Titre"
            value={newReward.title}
            onChange={(e) =>
              setNewReward({ ...newReward, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newReward.description}
            onChange={(e) =>
              setNewReward({ ...newReward, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Points"
            value={newReward.points}
            onChange={(e) =>
              setNewReward({
                ...newReward,
                points: parseInt(e.target.value) || 0,
              })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="ID du slave"
            value={newReward.slave_id}
            onChange={(e) =>
              setNewReward({
                ...newReward,
                slave_id: parseInt(e.target.value) || "",
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ Create Reward
          </button>
        </form>

        {/* Liste des Rewards */}
        <h3 className="text-lg font-semibold mb-2">📋 List of Rewards</h3>
        {rewards.length === 0 ? (
          <p className="text-gray-500">No rewards created</p>
        ) : (
          <ul className="space-y-2">
            {rewards.map((reward) => (
              <li key={reward.id} className="p-3 bg-gray-100 rounded shadow">
                <strong>{reward.title}</strong> — {reward.points} points
                <p className="text-sm">{reward.description}</p>
                <span className="text-xs italic">
                  Attribué au slave {reward.slave_id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

