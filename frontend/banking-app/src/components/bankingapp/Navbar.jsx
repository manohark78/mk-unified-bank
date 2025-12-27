import { NavLink, useNavigate } from "react-router-dom";
import { isAdmin } from "../../Authentication/auth";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const admin = isAdmin();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="mk-navbar">
      <div className="mk-brand" onClick={() => navigate(admin ? "/admin" : "/")}>
        M.K. Unified Bank
      </div>

      <div className="mk-navlinks">
        <NavLink to={admin ? "/admin" : "/"} className="mk-link">Home</NavLink>
        <NavLink to="/transfer" className="mk-link">Transfer</NavLink>
        <NavLink to="/history" className="mk-link">History</NavLink>
        {admin && <NavLink to="/add-account" className="mk-link">Create Account</NavLink>}
      </div>

      <button className="mk-logout" onClick={logout}>Logout</button>
    </nav>
  );
}
