import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

export default function ResistancePage() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          developer_email: "anon@resistance.dev",
        }),
      })

      if (res.ok) {
        const newFeedback = await res.json() // ✅ récupère le feedback créé
        setStatus("✅ Thank you for your feedback!")
        setMessage("")
        setFeedbacks([...feedbacks, newFeedback]) // ✅ ajout direct en local
      } else {
        setStatus("❌ Error when sending feedback.")
      }
    } catch {
      setStatus("⚠️ Impossible to contact server.")
    }
  }

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:8000/feedback")
      if (res.ok) {
        const data = await res.json()
        setFeedbacks(data)
      }
    } catch {
      console.error("Error uploading feedbacks")
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return (
    <div>
      {/* 🔹 Navbar */}
      <Navbar role="developer" />

      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ✊ Developers Resistance
        </h1>

        {/* Tips/memes */}
        <div className="space-y-4 mb-10">
          <p className="p-4 bg-red-100 rounded shadow">
            🔒 Advice: Use strong passwords!
          </p>
          <p className="p-4 bg-yellow-100 rounded shadow">
            🚫 Advice: Don't join suspect meetings.
          </p>
          <p className="p-4 bg-blue-100 rounded shadow">
            📢 Advice: Report any suspicious activity.
          </p>
          <img
            src="https://i.imgflip.com/7y5f7u.jpg"
            alt="Funny meme"
            className="rounded shadow"
          />
        </div>

        {/* Feedback form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 p-6 bg-gray-100 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold">📝 Write a feedback</h2>
          <textarea
            placeholder="Write your message here..."
            className="w-full p-2 border rounded"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
          {status && <p className="mt-2 text-center">{status}</p>}
        </form>

        {/* Feedback list */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            📜 Feedbacks of the Resistance
          </h2>
          {feedbacks.length === 0 && (
            <p className="text-gray-500">No feedback yet.</p>
          )}
          <ul className="space-y-2">
            {feedbacks.map((fb) => (
              <li key={fb.id} className="p-3 bg-white rounded shadow">
                {fb.message}{" "}
                <span className="text-sm text-gray-500">
                  ({fb.developer_email})
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

