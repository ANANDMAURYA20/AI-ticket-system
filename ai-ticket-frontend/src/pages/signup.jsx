import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove skills if role === "user"
      const payload = { ...form };
      if (payload.role === "user") {
        delete payload.skills;
      } else {
        // Convert comma-separated string → array
        payload.skills = payload.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body space-y-3">
          <h2 className="card-title justify-center">Sign Up</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Role Dropdown */}
          <select
            name="role"
            className="select select-bordered"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          {/* Skills (only show if moderator or admin) */}
          {(form.role === "moderator" || form.role === "admin") && (
            <input
              type="text"
              name="skills"
              placeholder="Enter skills (comma separated)"
              className="input input-bordered"
              value={form.skills}
              onChange={handleChange}
              required
            />
          )}

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
