import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function History() {
  const loc = useLocation();
  const accountId = loc.state?.accountId;
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const url = accountId
      ? `http://localhost:8080/api/transactions/account/${accountId}?page=0&size=20`
      : `http://localhost:8080/api/transactions/my?page=0&size=20`;
    (async () => {
      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
        if (!res.ok) { setMsg('Failed to load history'); return; }
        const data = await res.json();
        const content = data.content || data;
        setItems(content || []);
      } catch { setMsg('Network error'); }
    })();
  }, [accountId]);

  return (
    <div className="page">
      <h2>Transaction History</h2>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map(tx => (
          <li key={tx.id}>
            <span>{tx.transactionType}</span> — <span>{tx.amount}</span> — <span>{tx.transactionDate}</span>
            {tx.fromAccountNumber && <span> — From {tx.fromAccountNumber}</span>}
            {tx.toAccountNumber && <span> — To {tx.toAccountNumber}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
