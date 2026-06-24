import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      nav(res.data.user.role === 'seller' ? '/seller' : '/buyer');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed. Check backend is running.');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-emoji">🏡</div>
          <h1>LandHub</h1>
          <p>Buy and sell land easily.<br/>Connect buyers with sellers across India.</p>
          <div className="hero-pills">
            <span>🔐 Secure</span><span>📍 Location Maps</span><span>📸 Photo Gallery</span>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box card">
          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to your account</p>
          {err && <div className="err-box">⚠️ {err}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com"
                value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Your password"
                value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            </div>
            <button className="btn btn-primary auth-btn" disabled={busy}>
              {busy ? <><span className="spinner"/>Signing in...</> : 'Sign In →'}
            </button>
          </form>
          <p className="auth-link">No account? <Link to="/signup">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
