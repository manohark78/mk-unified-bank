import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Banking App</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/accounts" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          📊 All Accounts
        </NavLink>
        <NavLink 
          to="/create-account" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          ➕ Create Account
        </NavLink>
        <NavLink 
          to="/deposit-withdraw" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          💰 Deposit & Withdraw
        </NavLink>
        <NavLink 
          to="/liquid-money" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          💧 Liquid Money
        </NavLink>
      </nav>
    </aside>
  );
}
