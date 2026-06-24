import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import MapModal from '../components/MapModal';
import BuyModal from '../components/BuyModal';
import './Dashboard.css';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [tab,       setTab]      = useState('available');
  const [lands,     setLands]    = useState([]);
  const [purchases, setPurchases]= useState([]);
  const [loading,   setLoading]  = useState(true);
  const [search,    setSearch]   = useState('');
  const [mapLand,   setMapLand]  = useState(null);
  const [buyLand,   setBuyLand]  = useState(null);
  const [toast,     setToast]    = useState(null);
  const [apiErr,    setApiErr]   = useState('');

  const showToast = (msg,type='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const load = useCallback(async () => {
    setLoading(true); setApiErr('');
    try {
      const [lr, pr] = await Promise.all([
        api.get('/lands/available'),
        api.get('/lands/my-purchases')
      ]);
      setLands(Array.isArray(lr.data) ? lr.data : []);
      setPurchases(Array.isArray(pr.data) ? pr.data : []);
      console.log('Available lands fetched:', lr.data.length);
    } catch(e) {
      console.error('load error:', e);
      setApiErr(e.response?.data?.message || 'Cannot connect to backend. Is the server running on port 5000?');
    } finally { setLoading(false); }
  }, []);

  useEffect(()=>{ load(); },[load]);

  const filtered = lands.filter(l => {
    if(!search) return true;
    const q = search.toLowerCase();
    return [l.title,l.village,l.mandal,l.district,l.state,l.owner_name]
      .some(v => v?.toLowerCase().includes(q));
  });

  const onBuySuccess = () => {
    setBuyLand(null);
    showToast('🎉 Purchase successful!');
    load();
  };

  return (
    <div className="dash-page">
      <Navbar/>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="dash-wrap">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Buyer Dashboard</h1>
            <p>Welcome, <b>{user?.name}</b> — find your perfect land</p>
          </div>
          <div className="buyer-stats">
            <div className="bstat"><b>{lands.length}</b><span>Available</span></div>
            <div className="bstat"><b>{purchases.length}</b><span>Purchased</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab==='available'?'active':''}`} onClick={()=>setTab('available')}>
            🏞️ Available Lands <span className="tbadge">{lands.length}</span>
          </button>
          <button className={`tab ${tab==='purchases'?'active':''}`} onClick={()=>setTab('purchases')}>
            🏡 My Purchases <span className="tbadge">{purchases.length}</span>
          </button>
        </div>

        {/* Search */}
        {tab==='available' && (
          <div className="search-row card">
            <span>🔍</span>
            <input
              className="search-inp"
              placeholder="Search by title, village, mandal, district, state..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
            {search && <button className="clr-btn" onClick={()=>setSearch('')}>✕</button>}
          </div>
        )}

        {/* API Error */}
        {apiErr && (
          <div className="err-box">
            ⚠️ {apiErr}
            <button className="btn btn-ghost btn-sm" style={{marginLeft:12}} onClick={load}>Retry</button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loader-wrap"><div className="loader-big"/><p>Loading lands...</p></div>
        ) : tab==='available' ? (
          filtered.length === 0 ? (
            <div className="card empty">
              <span className="icon">🏞️</span>
              <b>{search ? 'No results found' : 'No lands available yet'}</b><br/>
              <small>{search ? 'Try different search terms' : 'Sellers have not listed any land yet'}</small>
              <br/><br/>
              <button className="btn btn-ghost btn-sm" onClick={load}>🔄 Refresh</button>
            </div>
          ) : (
            <div className="land-grid">
              {filtered.map(land=>(
                <BuyerLandCard
                  key={land.id}
                  land={land}
                  onDetails={()=>nav(`/land/${land.id}`)}
                  onMap={()=>setMapLand(land)}
                  onBuy={()=>setBuyLand(land)}
                />
              ))}
            </div>
          )
        ) : (
          purchases.length === 0 ? (
            <div className="card empty">
              <span className="icon">🛒</span>
              <b>No purchases yet</b><br/>
              <small>Browse available lands and make your first purchase</small>
              <br/><br/>
              <button className="btn btn-primary btn-sm" onClick={()=>setTab('available')}>Browse Lands</button>
            </div>
          ) : (
            <div className="land-grid">
              {purchases.map(p=><PurchasedCard key={p.id} p={p}/>)}
            </div>
          )
        )}
      </div>

      {mapLand && <MapModal land={mapLand} onClose={()=>setMapLand(null)}/>}
      {buyLand && <BuyModal land={buyLand} onClose={()=>setBuyLand(null)} onSuccess={onBuySuccess}/>}
    </div>
  );
}

/* ── Buyer Land Card ── */
function BuyerLandCard({ land, onDetails, onMap, onBuy }) {
  const img = land.images?.[0] ? `http://localhost:5000/uploads/${land.images[0]}` : null;
  return (
    <div className="land-card card">
      <div className="lc-img">
        {img
          ? <img src={img} alt={land.title} onError={e=>{e.target.style.display='none'}}/>
          : <div className="lc-noimg">🏞️</div>}
        <span className="badge badge-available">Available</span>
      </div>
      <div className="lc-body">
        <h3>{land.title}</h3>
        <div className="lc-seller">👤 Seller: <b>{land.seller_name}</b></div>
        <div className="lc-meta">📍 {[land.village,land.mandal,land.district,land.state].filter(Boolean).join(', ')||'Location N/A'}</div>
        <div className="lc-meta">📐 {land.total_area} Acres &nbsp;|&nbsp; 🔢 {land.survey_number||'N/A'}</div>
        <div className="lc-price">₹ {Number(land.price).toLocaleString('en-IN')}</div>
        <div className="lc-actions">
          <button className="btn btn-ghost btn-sm" onClick={onDetails}>📄 Details</button>
          <button className="btn btn-ghost btn-sm" onClick={onMap} disabled={!land.latitude}>🗺️ Map</button>
          <button className="btn btn-teal btn-sm" onClick={onBuy}>💳 Buy Now</button>
        </div>
      </div>
    </div>
  );
}

/* ── Purchased Land Card ── */
function PurchasedCard({ p }) {
  const img = p.images?.[0] ? `http://localhost:5000/uploads/${p.images[0]}` : null;
  return (
    <div className="land-card card" style={{borderColor:'rgba(16,185,129,0.2)'}}>
      <div className="lc-img">
        {img
          ? <img src={img} alt={p.title} onError={e=>{e.target.style.display='none'}}/>
          : <div className="lc-noimg">🏡</div>}
        <span className="badge badge-sold">Purchased</span>
      </div>
      <div className="lc-body">
        <h3>{p.title}</h3>
        <div className="lc-seller">👤 Seller: <b>{p.seller_name}</b></div>
        <div className="lc-meta">📍 {[p.village,p.district,p.state].filter(Boolean).join(', ')||'N/A'}</div>
        <div className="lc-meta">📐 {p.total_area} Acres</div>
        <div className="lc-price">₹ {Number(p.amount).toLocaleString('en-IN')}</div>
        <div className="lc-meta" style={{marginTop:8,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:8}}>
          📞 {p.contact_number||p.seller_phone||'N/A'}<br/>
          ✉️ {p.seller_email}<br/>
          📅 {new Date(p.purchase_date).toLocaleDateString('en-IN')}
        </div>
      </div>
    </div>
  );
}
