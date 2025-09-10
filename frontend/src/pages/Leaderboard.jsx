import { useEffect, useState } from "react"

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch("https://juan-sao-ville.onrender.com/leaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error servor")
        return res.json()
      })
      .then(setLeaders)
      .catch(() => setError("⚠️ Impossible to load the leaderboard"))
  }, [token])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard of Slaves</h1>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300 shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">#</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Captured Victims</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((slave, index) => (
            <tr key={slave.email} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 p-2">{slave.email}</td>
              <td className="border border-gray-300 p-2 text-center">{slave.victim_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
