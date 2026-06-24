import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', role:'' });
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setErr('');
    if (!form.role) { setErr('Please select a role'); return; }
    setBusy(true);
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.user, res.data.token);
      nav(res.data.user.role === 'seller' ? '/seller' : '/buyer');
    } catch (e) {
      setErr(e.response?.data?.message || 'Signup failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-emoji">🏡</div>
          <h1>LandHub</h1>
          <p>Join thousands of buyers and sellers on India's land marketplace.</p>
          <div className="role-cards">
            <div className="role-card"><span>🏗️</span><b>Seller</b><p>List your land</p></div>
            <div className="role-card"><span>🔍</span><b>Buyer</b><p>Find your land</p></div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box card">
          <h2>Create Account</h2>
          <p className="auth-sub">Join LandHub today</p>
          {err && <div className="err-box">⚠️ {err}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6}/>
            </div>
            <div className="form-group">
              <label className="form-label">I want to…</label>
              <div className="role-select">
                <div className={`role-opt ${form.role==='seller'?'active':''}`} onClick={()=>setForm({...form,role:'seller'})}>
                  <span>🏗️</span> Sell Land
                </div>
                <div className={`role-opt ${form.role==='buyer'?'active':''}`} onClick={()=>setForm({...form,role:'buyer'})}>
                  <span>🔍</span> Buy Land
                </div>
              </div>
            </div>
            <button className="btn btn-primary auth-btn" disabled={busy}>
              {busy ? <><span className="spinner"/>Creating...</> : 'Create Account →'}
            </button>
          </form>
          <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
