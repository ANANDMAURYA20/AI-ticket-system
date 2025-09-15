import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          Ticket AI
        </Link>

        {/* Menu */}
        <div className="flex gap-3 items-center">
          {!token ? (
            <>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition text-sm font-medium shadow-md"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition text-sm font-medium shadow-md"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-300 text-sm">Hi, {user?.email}</span>
              {user && user?.role === "admin" && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition text-sm font-medium shadow-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition text-sm font-medium shadow-md"
                  >
                    Admin
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition text-sm font-medium shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
