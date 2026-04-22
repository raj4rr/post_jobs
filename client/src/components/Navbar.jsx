import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <Link className="brand" to="/">RefJobs</Link>
      <nav className="nav-links">
        <Link to="/">Jobs</Link>
        {isAuthenticated && user?.role === "job_seeker" && <Link to="/profile">Profile</Link>}
        {isAuthenticated && user?.role === "job_seeker" && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && (user?.role === "job_poster" || user?.role === "admin") && <Link to="/post-job">Post Job</Link>}
        {isAuthenticated && (user?.role === "job_poster" || user?.role === "admin") && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>
      <div className="auth-zone">
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link className="btn" to="/register">Register</Link>}
        {isAuthenticated && (
          <>
            <span className="muted">{user?.name}</span>
            <button
              className="btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
