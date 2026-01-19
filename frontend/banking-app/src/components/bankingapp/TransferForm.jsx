import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAdmin, getAuthHeaders } from '../../Authentication/auth';
import './TransferForm.css';

export default function TransferForm() {
  const loc = useLocation();
  const defaultFrom = loc.state?.defaultFrom;

  const admin = isAdmin();

  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const url = admin
          ? 'http://localhost:8081/api/accounts'
          : 'http://localhost:8081/api/accounts/my';

        const res = await fetch(url, { headers: getAuthHeaders() });

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        const data = await res.json().catch(() => []);
        if (cancelled) return;

        setAccounts(data || []);

        if (defaultFrom) {
          setForm(f => ({ ...f, fromAccountNumber: defaultFrom }));
        } else if ((data || []).length) {
          setForm(f => ({ ...f, fromAccountNumber: data[0].accountNumber }));
        }
      } catch {
        if (!cancelled) setMsg('Failed to load accounts');
      }
    })();

    return () => { cancelled = true; };
  }, [defaultFrom, admin]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8081/api/transfers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fromAccountNumber: form.fromAccountNumber.trim(),
          toAccountNumber: form.toAccountNumber.trim(),
          amount: Number(form.amount),
          description: form.description || null
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.message || 'Transfer failed');
        return;
      }

      setMsg('Transfer successful');
      setForm(f => ({ ...f, toAccountNumber: '', amount: '', description: '' }));
    } catch {
      setMsg('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-card">
      <h2>{admin ? 'Admin Transfer' : 'Transfer'}</h2>

      <form className="transfer-grid" onSubmit={onSubmit}>
        <div className="transfer-row">
          <label>From account</label>

          {/* Dropdown for both. Admin gets all accounts; user gets only own */}
          <select
            name="fromAccountNumber"
            value={form.fromAccountNumber}
            onChange={onChange}
            disabled={loading}
            required
          >
            {accounts.map(a => (
              <option key={a.accountNumber} value={a.accountNumber}>
                {a.accountNumber} — {a.accountHolderName}
              </option>
            ))}
          </select>

          {/* If accounts empty show helper */}
          {accounts.length === 0 && (
            <small style={{ color: '#666' }}>
              No accounts available to select.
            </small>
          )}
        </div>

        <div className="transfer-row">
          <label>To account number</label>
          <input
            name="toAccountNumber"
            value={form.toAccountNumber}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <div className="transfer-row">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <div className="transfer-row full">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            disabled={loading}
          />
        </div>

        {msg && <div className="error">{msg}</div>}

        <div className="transfer-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
}
