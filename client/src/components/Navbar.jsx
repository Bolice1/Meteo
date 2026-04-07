import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-semibold text-white">
          Meteo
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {!user && (
            <>
              <NavLink to="/login" className="hover:text-white">
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-full bg-rain px-4 py-2 font-medium text-white transition hover:bg-blue-500">
                Create account
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to={user.role === "admin" ? "/admin" : "/dashboard"} className="hover:text-white">
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </NavLink>
              <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 hover:border-white/30 hover:text-white">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
