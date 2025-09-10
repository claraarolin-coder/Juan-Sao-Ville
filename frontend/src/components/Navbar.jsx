import { Link, useNavigate } from "react-router-dom"

export default function Navbar({ role }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">⚔️ Projet Juan</h1>

      <div className="space-x-4">
        {role === "admin" && (
          <>
            <Link to="/admin" className="hover:underline">Dashboard</Link>
            <Link to="/admin/rewards" className="hover:underline">Rewards</Link>
            <Link to="/admin/leaderboard" className="hover:underline">Leaderboard</Link>
          </>
        )}

        {role === "slave" && (
          <>
            <Link to="/slave" className="hover:underline">Dashboard</Link>
            <Link to="/slave/rewards" className="hover:underline">Mes Rewards</Link>
          </>
        )}

        {role === "developer" && (
          <Link to="/resistance" className="hover:underline">Résistance</Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
