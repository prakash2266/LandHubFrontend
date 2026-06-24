import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/login'); };
  const goHome = () => nav(user?.role === 'seller' ? '/seller' : '/buyer');

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={goHome}>
        <span className="nav-logo">🏡</span>
        <span className="nav-name">LandHub</span>
      </div>
      {user && (
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="nav-info">
              <span className="nav-uname">{user.name}</span>
              <span className={`nav-role ${user.role}`}>{user.role}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
