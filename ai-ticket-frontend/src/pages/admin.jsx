import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", "),
    });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-500">Manage Users & Permissions</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader text="Fetching users..." size="w-8 h-8" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              {/* User Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    <span className="text-gray-600">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="text-gray-600">Role:</span> {user.role}
                  </p>
                  <p>
                    <span className="text-gray-600">Skills:</span>{" "}
                    {user.skills && user.skills.length > 0
                      ? user.skills.join(", ")
                      : "N/A"}
                  </p>
                </div>

                {editingUser !== user.email && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Edit Form */}
              {editingUser === user.email && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <select
                    className="select select-bordered w-full"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Comma-separated skills"
                    className="input input-bordered w-full"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  />

                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm flex items-center gap-2"
                      onClick={handleUpdate}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader size="w-4 h-4" text="Saving..." />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
