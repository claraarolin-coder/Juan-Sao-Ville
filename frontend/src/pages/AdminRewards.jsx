import { useState } from "react"

export default function AdminRewards() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [points, setPoints] = useState(0)
  const [slaveId, setSlaveId] = useState("")
  const [status, setStatus] = useState(null)

  const token = localStorage.getItem("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    try {
      const response = await fetch("http://localhost:8000/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          points: parseInt(points),
          slave_id: parseInt(slaveId),
        }),
      })

      if (!response.ok) {
        setStatus("❌ Error creating reward")
        return
      }

      setStatus("✅ Reward successfully created !")
      setTitle("")
      setDescription("")
      setPoints(0)
      setSlaveId("")
    } catch (err) {
      console.error(err)
      setStatus("⚠️ Impossible to contact the servor")
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎁 Managing of rewards</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-6 rounded shadow"
      >
        <input
          type="text"
          placeholder="Titre"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Points"
          className="w-full p-2 border rounded"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID du Slave"
          className="w-full p-2 border rounded"
          value={slaveId}
          onChange={(e) => setSlaveId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Create Reward
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  )
}
