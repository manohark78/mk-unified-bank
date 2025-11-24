import { Link, useNavigate } from 'react-router-dom';
import { isAdmin } from '../../Authentication/auth';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const admin = isAdmin();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <span className="brand-mark">MyBank</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/transfer">Transfer</Link></li>
        <li><Link to="/history">History</Link></li>
        {admin && <li><Link to="/add-account">Create Account</Link></li>}
      </ul>

      <div className="nav-actions">
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
