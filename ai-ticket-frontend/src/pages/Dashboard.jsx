import { useEffect, useState } from "react";

// 🔹 Reusable Loader Component
function Loader({ size = "w-6 h-6", text }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent border-blue-500 ${size}`}
      ></div>
      {text && <span>{text}</span>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/dashboard-stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." size="w-10 h-10" />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-blue-600 text-white p-4">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card bg-green-600 text-white p-4">
          <h3 className="text-lg font-semibold">Moderators</h3>
          <p className="text-2xl font-bold">{stats?.totalModerators || 0}</p>
        </div>
        <div className="card bg-purple-600 text-white p-4">
          <h3 className="text-lg font-semibold">Total Tickets</h3>
          <p className="text-2xl font-bold">{stats?.totalTickets || 0}</p>
        </div>
        <div className="card bg-orange-600 text-white p-4">
          <h3 className="text-lg font-semibold">Assigned Tickets</h3>
          <p className="text-2xl font-bold">{stats?.assignedTickets || 0}</p>
        </div>
      </div>

      {/* Moderators Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Moderators & Their Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.moderators?.map((moderator, index) => (
            <div key={index} className="card bg-base-100 shadow p-4">
              <h3 className="font-bold text-lg">{moderator.email}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Skills: {moderator.skills?.join(", ") || "No skills"}
              </p>
              <p className="text-sm font-semibold">
                Assigned Tickets: {moderator.assignedTickets?.length || 0}
              </p>
              {moderator.assignedTickets?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold mb-1">Recent Assignments:</p>
                  {moderator.assignedTickets.slice(0, 3).map((ticket) => (
                    <div
                      key={ticket._id}
                      className="text-xs bg-gray-100 p-1 rounded mb-1"
                    >
                      {ticket.title || "No Title"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Tickets</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Created By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTickets?.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="font-semibold">{ticket.title}</td>
                  <td>
                    <span
                      className={`badge ${
                        ticket.status === "TODO"
                          ? "badge-warning"
                          : ticket.status === "IN_PROGRESS"
                          ? "badge-info"
                          : "badge-success"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        ticket.priority === "high"
                          ? "badge-error"
                          : ticket.priority === "medium"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {ticket.priority || "N/A"}
                    </span>
                  </td>
                  <td>{ticket.assignedTo?.email || "Unassigned"}</td>
                  <td>{ticket.createdBy?.email || "N/A"}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
