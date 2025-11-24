import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TransferForm.css';

export default function TransferForm() {
  const loc = useLocation();
  const defaultFrom = loc.state?.defaultFrom;
  const [myAccounts, setMyAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: '' });
  const [msg, setMsg] = useState(''); const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('http://localhost:8080/api/accounts/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json().catch(()=>[]);
      setMyAccounts(data || []);
      if (defaultFrom) setForm(f => ({ ...f, fromAccountNumber: defaultFrom }));
      else if (data?.length) setForm(f => ({ ...f, fromAccountNumber: data[0].accountNumber }));
    })();
  }, [defaultFrom]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault(); setMsg(''); setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          fromAccountNumber: form.fromAccountNumber.trim(),
          toAccountNumber: form.toAccountNumber.trim(),
          amount: Number(form.amount),
          description: form.description || null
        })
      });
      const data = await res.json().catch(()=> ({}));
      if (!res.ok) { setMsg(data.message || 'Transfer failed'); return; }
      setMsg('Transfer successful'); setForm(f => ({ ...f, toAccountNumber: '', amount: '', description: '' }));
    } catch { setMsg('Network error'); } finally { setLoading(false); }
  };

  return (
    <div className="transfer-card">
      <h2>Transfer</h2>
      <form className="transfer-grid" onSubmit={onSubmit}>
        <div className="transfer-row">
          <label>From account</label>
          <select name="fromAccountNumber" value={form.fromAccountNumber} onChange={onChange} disabled={loading}>
            {myAccounts.map(a => (
              <option key={a.accountNumber} value={a.accountNumber}>
                {a.accountNumber} — {a.accountHolderName}
              </option>
            ))}
          </select>
        </div>
        <div className="transfer-row">
          <label>To account number</label>
          <input name="toAccountNumber" value={form.toAccountNumber} onChange={onChange} required disabled={loading} />
        </div>
        <div className="transfer-row">
          <label>Amount</label>
          <input type="number" step="0.01" name="amount" value={form.amount} onChange={onChange} required disabled={loading} />
        </div>
        <div className="transfer-row full">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows={3} disabled={loading} />
        </div>
        {msg && <div className="error">{msg}</div>}
        <div className="transfer-actions">
          <button type="submit" disabled={loading}>{loading ? 'Transferring...' : 'Transfer'}</button>
        </div>
      </form>
    </div>
  );
}
