import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false); // for submit
  const [fetching, setFetching] = useState(true); // for fetch

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // 👈 get user from storage
  const role = user?.role || "user"; // default to user if not found
  const navigate = useNavigate();

  const fetchTickets = async () => {
    if (!token) {
      navigate("/login"); // Redirect if not authorized
      return;
    }

    setFetching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Form Section */}
        {(role === "user" || role === "admin") && (
          <div className="mb-10 bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Create Ticket
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ticket Title"
                className="input input-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ticket Description"
                className="textarea textarea-bordered w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                required
              ></textarea>
              <button
                className="btn w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader size="w-5 h-5" text="Submitting..." />
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tickets Section */}
        <h2 className="text-xl font-semibold mb-4 text-purple-300">
          All Tickets
        </h2>

        {fetching ? (
          <div className="flex justify-center">
            <Loader text="Fetching tickets..." size="w-10 h-10" />
          </div>
        ) : tickets.length > 0 ? (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                className="block bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg hover:border-purple-500 border border-gray-700 transition-colors"
                to={`/tickets/${ticket._id}`}
              >
                <h3 className="font-bold text-lg text-purple-300">
                  {ticket.title}
                </h3>
                <p className="text-gray-300">{ticket.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No tickets submitted yet.</p>
        )}
      </div>
    </div>
  );
}
