import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import LandForm from '../components/LandForm';
import './Dashboard.css';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [lands,   setLands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editLand,setEditLand]= useState(null);
  const [delLand, setDelLand] = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/lands/seller/my-lands');
      setLands(r.data);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(()=>{ load(); },[load]);

  const handleDelete = async () => {
    try {
      await api.delete(`/lands/delete/${delLand.id}`);
      showToast('Land deleted');
      setDelLand(null); load();
    } catch(e){ showToast(e.response?.data?.message||'Delete failed','err'); }
  };

  const total     = lands.length;
  const available = lands.filter(l=>l.status==='available').length;
  const sold      = lands.filter(l=>l.status==='sold').length;

  return (
    <div className="dash-page">
      <Navbar/>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="dash-wrap">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p>Welcome, <b>{user?.name}</b> — manage your land listings</p>
          </div>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add New Land</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card card"><div className="stat-icon blue">🗺️</div><div><div className="stat-val">{total}</div><div className="stat-lbl">Total</div></div></div>
          <div className="stat-card card"><div className="stat-icon green">✅</div><div><div className="stat-val">{available}</div><div className="stat-lbl">Available</div></div></div>
          <div className="stat-card card"><div className="stat-icon red">🏷️</div><div><div className="stat-val">{sold}</div><div className="stat-lbl">Sold</div></div></div>
        </div>

        {/* Lands */}
        <div className="card land-table-wrap">
          <div className="section-head">
            <h2>My Listings</h2>
            <span className="count-tag">{lands.length} properties</span>
          </div>
          {loading ? (
            <div className="loader-wrap"><div className="loader-big"/><p>Loading...</p></div>
          ) : lands.length === 0 ? (
            <div className="empty"><span className="icon">🏞️</span><b>No listings yet</b><br/><small>Click "Add New Land" to get started</small></div>
          ) : (
            <div className="land-grid">
              {lands.map(land=>(
                <SellerLandCard
                  key={land.id}
                  land={land}
                  onEdit={()=>setEditLand(land)}
                  onDelete={()=>setDelLand(land)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <LandForm
          title="Add New Land"
          onClose={()=>setShowAdd(false)}
          onSuccess={()=>{ setShowAdd(false); load(); showToast('Land added! Buyers can now see it.'); }}
        />
      )}

      {/* Edit Modal */}
      {editLand && (
        <LandForm
          title="Edit Land"
          land={editLand}
          onClose={()=>setEditLand(null)}
          onSuccess={()=>{ setEditLand(null); load(); showToast('Land updated!'); }}
        />
      )}

      {/* Delete Confirm */}
      {delLand && (
        <div className="overlay">
          <div className="modal modal-sm" style={{padding:'36px',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:12}}>⚠️</div>
            <h3 style={{marginBottom:8}}>Delete Land?</h3>
            <p style={{color:'rgba(255,255,255,0.55)',marginBottom:24,fontSize:14}}>
              Are you sure you want to delete <b>"{delLand.title}"</b>?
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button className="btn btn-ghost" onClick={()=>setDelLand(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SellerLandCard({ land, onEdit, onDelete }) {
  const img = land.images?.[0] ? `http://localhost:5000/uploads/${land.images[0]}` : null;
  return (
    <div className="land-card card">
      <div className="lc-img">
        {img ? <img src={img} alt={land.title}/> : <div className="lc-noimg">🏞️</div>}
        <span className={`badge badge-${land.status}`}>{land.status}</span>
      </div>
      <div className="lc-body">
        <h3>{land.title}</h3>
        <div className="lc-meta">📍 {[land.village,land.mandal,land.district].filter(Boolean).join(', ')||'Location N/A'}</div>
        <div className="lc-meta">👤 {land.owner_name} &nbsp;|&nbsp; 📐 {land.total_area} Acres</div>
        <div className="lc-meta">🔢 Survey: {land.survey_number||'N/A'}</div>
        <div className="lc-price">₹ {Number(land.price).toLocaleString('en-IN')}</div>
        <div className="lc-actions">
          <button className="btn btn-ghost btn-sm" onClick={onEdit} disabled={land.status==='sold'}>✏️ Edit</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete} disabled={land.status==='sold'}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}
