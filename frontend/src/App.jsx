import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import SlaveDashboard from "./pages/SlaveDashboard"
import ResistancePage from "./pages/ResistancePage"

function App() {
  return (
    <Routes>
      {/* page d’accueil → redirige vers login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* login */}
      <Route path="/login" element={<Login />} />

      {/* dashboards */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/slave" element={<SlaveDashboard />} />
      <Route path="/resistance" element={<ResistancePage />} />
    </Routes>
  )
}

export default App


