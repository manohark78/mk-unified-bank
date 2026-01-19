import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthHeaders, isAdmin } from '../../Authentication/auth';
import './AccountDetails.css';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // deposit | withdraw | liquid-deposit | liquid-withdraw
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const admin = isAdmin();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError('');
      try {
        const url = admin
          ? `http://localhost:8081/api/accounts/${id}`
          : `http://localhost:8081/api/accounts/owned/${id}`;
        const res = await fetch(url, { headers: getAuthHeaders() });

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError(res.status === 403 ? 'Forbidden: not your account' : 'Account not found');
          return;
        }
        const data = await res.json();
        if (!cancelled) setAccount(data);
      } catch {
        if (!cancelled) setError('Failed to load account details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, admin]); // depend on id and admin because both change the URL

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setAmount('');
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setAmount('');
    setError('');
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const endpointsAdmin = {
      deposit: `/api/accounts/${id}/deposit`,
      withdraw: `/api/accounts/${id}/withdraw`,
      'liquid-deposit': `/api/accounts/${id}/liquid/deposit`,
      'liquid-withdraw': `/api/accounts/${id}/liquid/withdraw`,
    };
    const endpointsUser = {
      'liquid-deposit': `/api/accounts/owned/${id}/liquid/deposit`,
      'liquid-withdraw': `/api/accounts/owned/${id}/liquid/withdraw`,
      // deposit/withdraw on main balance are admin-only and will 403 for users
      deposit: `/api/accounts/${id}/deposit`,
      withdraw: `/api/accounts/${id}/withdraw`,
    };

    const path = (admin ? endpointsAdmin : endpointsUser)[modalType];

    try {
      const res = await fetch(`http://localhost:8081${path}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || (res.status === 403 ? 'Forbidden' : 'Transaction failed'));
        return;
      }

      const updated = await res.json();
      setAccount(updated);
      closeModal();
      alert('Transaction successful!');
    } catch {
      setError('Failed to process transaction');
    }
  };

  if (loading) return <div className="loading">Loading account details...</div>;

  if (error && !account) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>Back to Accounts</button>
      </div>
    );
  }

  return (
    <div className="account-details-container">
      <div className="details-header">
        <button onClick={() => navigate('/')} className="btn-back">← Back</button>
        <h2>Account Details</h2>
        {isAdmin() && (
          <button
            onClick={async () => {
              if (!window.confirm('Delete this account?')) return;
              try {
                const res = await fetch(`http://localhost:8081/api/accounts/${id}`, {
                  method: 'DELETE',
                  headers: getAuthHeaders(),
                });
                if (res.ok) { alert('Account deleted'); navigate('/'); }
              } catch { alert('Failed to delete account'); }
            }}
            className="btn-delete"
          >
            Delete Account
          </button>
        )}
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><span className="label">Account Holder Name</span><span className="value">{account.accountHolderName}</span></div>
            <div className="info-item"><span className="label">Phone Number</span><span className="value">{account.phoneNumber}</span></div>
            <div className="info-item"><span className="label">Account Number</span><span className="value highlight">{account.accountNumber}</span></div>
            <div className="info-item"><span className="label">Customer ID</span><span className="value highlight">{account.customerId}</span></div>
          </div>
        </div>

        <div className="details-card">
          <h3>Address Details</h3>
          <div className="info-grid">
            <div className="info-item full-width"><span className="label">Address</span><span className="value">{account.addressLine || 'Not provided'}</span></div>
            <div className="info-item"><span className="label">City</span><span className="value">{account.city || 'N/A'}</span></div>
            <div className="info-item"><span className="label">State</span><span className="value">{account.stateName || 'N/A'}</span></div>
            <div className="info-item"><span className="label">Pincode</span><span className="value">{account.pincode || 'N/A'}</span></div>
            <div className="info-item"><span className="label">Country</span><span className="value">{account.country || 'N/A'}</span></div>
          </div>
        </div>

        <div className="details-card">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item"><span className="label">Account Type</span><span className="value badge">{account.accountType}</span></div>
            <div className="info-item"><span className="label">Account Status</span><span className={`value badge ${account.accountStatus?.toLowerCase()}`}>{account.accountStatus}</span></div>
            <div className="info-item"><span className="label">Account Opened</span><span className="value">{account.accountOpenDate}</span></div>
          </div>
        </div>
      </div>

      <div className="balance-cards">
        <div className="balance-card primary">
          <h3>Current Balance</h3>
          <div className="balance-amount">₹{Number(account.balance || 0).toFixed(2)}</div>
          <div className="balance-actions">
            <button onClick={() => openModal('deposit')} className="btn-action deposit">Deposit</button>
            <button onClick={() => openModal('withdraw')} className="btn-action withdraw">Withdraw</button>
          </div>
        </div>

        <div className="balance-card secondary">
          <h3>Liquid Balance</h3>
          <div className="balance-amount">₹{Number(account.liquidBalance || 0).toFixed(2)}</div>
          <div className="balance-actions">
            <button onClick={() => openModal('liquid-deposit')} className="btn-action deposit">Move to Liquid</button>
            <button onClick={() => openModal('liquid-withdraw')} className="btn-action withdraw">Move from Liquid</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalType === 'deposit' && 'Deposit Money'}
              {modalType === 'withdraw' && 'Withdraw Money'}
              {modalType === 'liquid-deposit' && 'Move to Liquid Balance'}
              {modalType === 'liquid-withdraw' && 'Move from Liquid Balance'}
            </h3>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-body">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-cancel">Cancel</button>
              <button onClick={handleTransaction} className="btn-confirm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
