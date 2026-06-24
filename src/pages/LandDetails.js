import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import MapModal from '../components/MapModal';
import BuyModal from '../components/BuyModal';
import './LandDetails.css';

export default function LandDetails() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [land,    setLand]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [selImg,  setSelImg]  = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [toast,   setToast]   = useState(null);

  useEffect(()=>{
    api.get(`/lands/details/${id}`)
      .then(r=>{ setLand(r.data); setLoading(false); })
      .catch(()=>setLoading(false));
  },[id]);

  const showToast = (m,t='ok') => { setToast({m,t}); setTimeout(()=>setToast(null),3000); };

  if(loading) return <div className="dash-page"><Navbar/><div className="loader-wrap"><div className="loader-big"/><p>Loading...</p></div></div>;
  if(!land)   return <div className="dash-page"><Navbar/><div className="loader-wrap"><span style={{fontSize:48}}>⚠️</span><p>Land not found</p><button className="btn btn-ghost" onClick={()=>nav(-1)}>← Go Back</button></div></div>;

  const images = land.images || [];

  return (
    <div className="dash-page">
      <Navbar/>
      {toast && <div className={`toast toast-${toast.t}`}>{toast.m}</div>}
      <div className="ld-wrap">
        <button className="back-btn" onClick={()=>nav(-1)}>← Back</button>

        <div className="ld-grid">
          {/* Gallery */}
          <div className="ld-gallery">
            <div className="ld-main-img">
              {images.length > 0
                ? <img src={`http://localhost:5000/uploads/${images[selImg]}`} alt={land.title}/>
                : <div className="lc-noimg" style={{height:'100%'}}>🏞️</div>
              }
              <span className={`badge badge-${land.status} ld-status-badge`}>{land.status}</span>
            </div>
            {images.length > 1 && (
              <div className="ld-thumbs">
                {images.map((img,i)=>(
                  <img key={i} src={`http://localhost:5000/uploads/${img}`} alt=""
                    className={`ld-thumb ${i===selImg?'active':''}`}
                    onClick={()=>setSelImg(i)}/>
                ))}
              </div>
            )}
            <div className="ld-btns">
              {land.latitude && (
                <button className="btn btn-ghost" onClick={()=>setShowMap(true)}>🗺️ View on Map</button>
              )}
              {land.status==='available' && (
                <button className="btn btn-teal" onClick={()=>setShowBuy(true)}>💳 Buy Now</button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="ld-info">
            <div className="card ld-info-card">
              <h1>{land.title}</h1>
              <div className="ld-price">₹ {Number(land.price).toLocaleString('en-IN')}</div>

              <div className="ld-section">
                <div className="ld-sec-title">📋 Land Information</div>
                <Row label="Owner"      value={land.owner_name}/>
                <Row label="Survey No." value={land.survey_number}/>
                <Row label="Area"       value={`${land.total_area} Acres`}/>
                <Row label="Contact"    value={land.contact_number}/>
                <Row label="Status"     value={<span className={`badge badge-${land.status}`}>{land.status}</span>}/>
              </div>

              <div className="ld-section">
                <div className="ld-sec-title">📍 Location</div>
                <Row label="Village"  value={land.village}/>
                <Row label="Mandal"   value={land.mandal}/>
                <Row label="District" value={land.district}/>
                <Row label="State"    value={land.state}/>
                {land.latitude && <Row label="GPS" value={`${Number(land.latitude).toFixed(6)}, ${Number(land.longitude).toFixed(6)}`}/>}
              </div>

              <div className="ld-section">
                <div className="ld-sec-title">👤 Seller Info</div>
                <Row label="Seller" value={land.seller_name}/>
                <Row label="Email"  value={land.seller_email}/>
                <Row label="Phone"  value={land.seller_phone}/>
              </div>

              {land.description && (
                <div className="ld-section">
                  <div className="ld-sec-title">📝 Description</div>
                  <p className="ld-desc">{land.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMap && <MapModal land={land} onClose={()=>setShowMap(false)}/>}
      {showBuy && (
        <BuyModal land={land} onClose={()=>setShowBuy(false)}
          onSuccess={()=>{ setShowBuy(false); showToast('Purchase successful! 🎉'); setTimeout(()=>nav('/buyer'),1500); }}/>
      )}
    </div>
  );
}

function Row({label,value}){
  return (
    <div className="ld-row">
      <span className="ld-label">{label}</span>
      <span className="ld-value">{value||'—'}</span>
    </div>
  );
}
