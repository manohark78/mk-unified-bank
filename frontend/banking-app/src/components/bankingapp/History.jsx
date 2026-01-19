import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAdmin, getAuthHeaders } from '../../Authentication/auth';

export default function History() {
  const loc = useLocation();
  const accountId = loc.state?.accountId;

  const admin = isAdmin();

  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    const url = accountId
      ? `http://localhost:8081/api/transactions/account/${accountId}?page=0&size=20`
      : admin
        ? `http://localhost:8081/api/transactions/all?page=0&size=20`
        : `http://localhost:8081/api/transactions/my?page=0&size=20`;

    (async () => {
      try {
        const res = await fetch(url, { headers: getAuthHeaders() });

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        if (!res.ok) {
          if (!cancelled) setMsg('Failed to load history');
          return;
        }

        const data = await res.json();
        const content = data?.content ?? data;
        if (!cancelled) setItems(content || []);
      } catch {
        if (!cancelled) setMsg('Network error');
      }
    })();

    return () => { cancelled = true; };
  }, [accountId, admin]);

  return (
    <div className="page">
      <h2>{admin ? 'All Transaction History' : 'Transaction History'}</h2>

      {msg && <p>{msg}</p>}

      {!msg && items.length === 0 && (
        <p>No transactions found.</p>
      )}

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
