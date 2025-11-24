import { useState } from 'react';
import { depositApi,withdrawApi } from './apiService/BankingApiService';

const AccountActions = ({ isAdmin }) => {
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const run = async (fn) => {
    try {
      await fn(Number(id), parseFloat(amount));
      setMessage('Success');
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed');
    }
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <label>
        <span>Account ID</span>
        <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
      </label>
      <label>
        <span>Amount</span>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="primary" disabled={!isAdmin} onClick={() => run(depositApi)}>
          Deposit
        </button>
        <button className="primary" disabled={!isAdmin} onClick={() => run(withdrawApi)}>
          Withdraw
        </button>
      </div>
      {message && <div className="muted">{message}</div>}
      {!isAdmin && <div className="muted">Admin only</div>}
    </form>
  );
};

export default AccountActions;