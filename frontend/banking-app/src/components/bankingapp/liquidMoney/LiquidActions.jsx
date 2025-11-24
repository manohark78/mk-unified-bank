import { useState } from 'react';
import { liquidWithdrawApi } from '../apiService/LiquidApiService';
import { liquidDepositApi } from '../apiService/LiquidApiService';

const LiquidActions = ({ onSuccess }) => {
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const run = async (mode) => {
    setMessage('');
    try {
      if (mode === 'deposit') {
        await liquidDepositApi(Number(id), parseFloat(amount));
        setMessage('Transferred to liquid successfully');
      } else {
        await liquidWithdrawApi(Number(id), parseFloat(amount));
        setMessage('Transferred to main successfully');
      }
      setId(''); setAmount('');
      if(onSuccess) onSuccess(); // To refresh list after success
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed');
    }
  };

  return (
    <form className="form" onSubmit={e => e.preventDefault()}>
      <label>
        <span>Account ID</span>
        <input type="number" value={id} onChange={e => setId(e.target.value)} required />
      </label>
      <label>
        <span>Amount</span>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="primary" type="button" disabled={!id || !amount} onClick={() => run('deposit')}>To Liquid</button>
        <button className="primary" type="button" disabled={!id || !amount} onClick={() => run('withdraw')}>From Liquid</button>
      </div>
      {message && <div className="muted">{message}</div>}
    </form>
  );
};

export default LiquidActions;