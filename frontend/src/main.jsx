import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SlaveDashboard from './pages/SlaveDashboard.jsx'
import ResistancePage from './pages/ResistancePage.jsx'
import AdminRewards from "./pages/AdminRewards.jsx"
import SlaveRewards from "./pages/SlaveRewards.jsx"
import Leaderboard from "./pages/Leaderboard.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* routes principales */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/slave" element={<SlaveDashboard />} />
        <Route path="/resistance" element={<ResistancePage />} />

        {/* routes admin */}
        <Route path="/admin/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />

        {/* routes slave */}
        <Route path="/slave/rewards" element={<SlaveRewards />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
