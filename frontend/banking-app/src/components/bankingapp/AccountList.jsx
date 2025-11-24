import { useEffect, useState } from 'react';
import { getAuthHeaders, isAdmin } from '../../Authentication/auth';
import { useNavigate } from 'react-router-dom';
import './AccountList.css';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const admin = isAdmin();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const url = admin
          ? 'http://localhost:8080/api/accounts'       // admin: all
          : 'http://localhost:8080/api/accounts/my';   // user: own only
        const res = await fetch(url, { headers: getAuthHeaders() });

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          if (!cancelled) setMsg('Failed to load accounts');
          return;
        }
        const data = await res.json();
        if (!cancelled) setAccounts(data || []);
      } catch {
        if (!cancelled) setMsg('Network error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [admin]); // depend on admin because it changes the URL

  const viewDetails = (accountId) => navigate(`/account/${accountId}`);

  if (loading) return <div className="loading">Loading accounts...</div>;

  return (
    <div className="account-list-container">
     <div className="header">
        <h2>{admin ? 'All Accounts' : 'My Accounts'}</h2>
            <div className="quick-actions">
                    <button onClick={() => navigate('/transfer')} className="btn-add">Transfer</button>
                    <button onClick={() => navigate('/history')} className="btn-add">History</button>
                    {admin && (
                    <button onClick={() => navigate('/add-account')} className="btn-add">
                        + Create New Account
                    </button>
                    )}
            </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/transfer')} className="btn-add" title="Transfer">
            Transfer
          </button>
          <button onClick={() => navigate('/history')} className="btn-add" title="History">
            History
          </button>
        </div>
      </div>

      {msg && <div className="error">{msg}</div>}

      {accounts.length === 0 ? (
        <div className="no-accounts">
          <p>No accounts found</p>
          {admin && (
            <button onClick={() => navigate('/add-account')} className="btn-add">
              Create First Account
            </button>
          )}
        </div>
      ) : (
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="account-card"
              onClick={() => viewDetails(account.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="account-header">
                <h3>{account.accountHolderName}</h3>
                <span className={`status ${account.accountStatus?.toLowerCase()}`}>
                  {account.accountStatus}
                </span>
              </div>

              <div className="account-details">
                <div className="detail-row">
                  <span className="label">Account Number:</span>
                  <span className="value">{account.accountNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Customer ID:</span>
                  <span className="value">{account.customerId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Account Type:</span>
                  <span className="value">{account.accountType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{account.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">City:</span>
                  <span className="value">{account.city || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Opened:</span>
                  <span className="value">{account.accountOpenDate}</span>
                </div>
              </div>

              <div className="balance-section">
                <div className="balance-item">
                  <span className="balance-label">Balance</span>
                  <span className="balance-amount">₹{Number(account.balance || 0).toFixed(2)}</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Liquid Balance</span>
                  <span className="balance-amount">₹{Number(account.liquidBalance || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList;
