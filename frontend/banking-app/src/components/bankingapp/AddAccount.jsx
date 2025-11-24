import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAccount.css';

export default function AddAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    accountHolderName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    addressLine: '',
    city: '',
    stateName: '',
    pincode: '',
    country: '',
    accountType: 'SAVINGS',
    balance: '',
    liquidBalance: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineePhone: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg('');
    if (!form.accountHolderName || !form.email || !form.phoneNumber || !form.dateOfBirth) {
      setMsg('Name, email, phone, and DOB are required');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        accountHolderName: form.accountHolderName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth, // yyyy-MM-dd from <input type="date">
        addressLine: form.addressLine || null,
        city: form.city || null,
        stateName: form.stateName || null,
        pincode: form.pincode || null,
        country: form.country || null,
        accountType: form.accountType,
        balance: form.balance ? Number(form.balance) : 0,
        liquidBalance: form.liquidBalance ? Number(form.liquidBalance) : 0,
        nomineeName: form.nomineeName || null,
        nomineeRelationship: form.nomineeRelationship || null,
        nomineePhone: form.nomineePhone || null
      };

      const res = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.message || 'Failed to create account');
        return;
      }

      setMsg('Account created');
      setTimeout(() => navigate('/'), 600);
    } catch {
      setMsg('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <h2>Create Account</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="form-row">
            <label>Full name</label>
            <input name="accountHolderName" value={form.accountHolderName} onChange={onChange} required disabled={loading} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} required disabled={loading} />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} required disabled={loading} />
          </div>
          <div className="form-row">
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required disabled={loading} />
          </div>

          <div className="form-row full">
            <label>Address line</label>
            <input name="addressLine" value={form.addressLine} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>City</label>
            <input name="city" value={form.city} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>State</label>
            <input name="stateName" value={form.stateName} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>Pincode</label>
            <input name="pincode" value={form.pincode} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>Country</label>
            <input name="country" value={form.country} onChange={onChange} disabled={loading} />
          </div>

          <div className="form-row">
            <label>Account type</label>
            <select name="accountType" value={form.accountType} onChange={onChange} disabled={loading}>
              <option value="SAVINGS">SAVINGS</option>
              <option value="CURRENT">CURRENT</option>
              <option value="SALARY">SALARY</option>
            </select>
          </div>
          <div className="form-row">
            <label>Opening balance</label>
            <input type="number" step="0.01" name="balance" value={form.balance} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>Liquid balance</label>
            <input type="number" step="0.01" name="liquidBalance" value={form.liquidBalance} onChange={onChange} disabled={loading} />
          </div>

          <div className="form-row">
            <label>Nominee name</label>
            <input name="nomineeName" value={form.nomineeName} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>Nominee relationship</label>
            <input name="nomineeRelationship" value={form.nomineeRelationship} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-row">
            <label>Nominee phone</label>
            <input name="nomineePhone" value={form.nomineePhone} onChange={onChange} disabled={loading} />
          </div>

          {msg && <div className="error">{msg}</div>}

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
