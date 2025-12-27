import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-home">
      <div className="admin-hero">
        <h1>Welcome to M.K. Unified Bank</h1>
        <p>Manage your accounts and transactions securely</p>
      </div>

      <div className="admin-cards">
        <div className="admin-card" onClick={() => navigate("/")}>
          <div className="admin-card-icon">🏦</div>
          <div className="admin-card-title">View All Accounts</div>
        </div>

        <div className="admin-card" onClick={() => navigate("/transfer")}>
          <div className="admin-card-icon">💱</div>
          <div className="admin-card-title">Transfer Funds</div>
        </div>

        <div className="admin-card" onClick={() => navigate("/history")}>
          <div className="admin-card-icon">🧾</div>
          <div className="admin-card-title">Transaction History</div>
        </div>
      </div>
    </div>
  );
}
