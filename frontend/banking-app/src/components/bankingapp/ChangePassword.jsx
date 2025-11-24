import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [form, setForm] = useState({ username: '', oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('username') || '';
    if (u) setForm(f => ({ ...f, username: u }));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setMsg('');
    if (!form.username || !form.oldPassword || !form.newPassword) {
      setMsg('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Clear the first-login flag and token; force fresh login
        localStorage.setItem('passwordChangeRequired', 'false');
        localStorage.removeItem('token');
        setMsg('Password updated. Please login again.');
        setTimeout(() => navigate('/login'), 800);
      } else {
        setMsg(data.message || 'Failed to update password');
      }
    } catch {
      setMsg('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Change Password</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Username (email or phone)</label>
            <input name="username" value={form.username} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Old password</label>
            <input type="password" name="oldPassword" value={form.oldPassword} onChange={onChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={onChange} disabled={loading} />
          </div>
          {msg && <div className="error-message">{msg}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
        </form>
      </div>
    </div>
  );
}
