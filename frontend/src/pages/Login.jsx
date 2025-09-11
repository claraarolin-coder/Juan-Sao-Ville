import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // 👉 Envoi au backend avec axios (form-urlencoded)
      const res = await axios.post(
        `${API_URL}/auth/login`,
        new URLSearchParams({
          username: email, // ⚠️ doit s’appeler username, pas email
          password: password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )

      const token = res.data.access_token
      localStorage.setItem("token", token)

      // 👉 Récupérer l'utilisateur courant
      const resUser = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const user = resUser.data
      localStorage.setItem("role", user.role)

      // 👉 Redirection selon le rôle
      if (user.role === "admin") navigate("/admin")
      else if (user.role === "slave") navigate("/slave")
      else navigate("/resistance")
    } catch (err) {
      console.error(err)
      setError("❌ Invalid username or password")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
