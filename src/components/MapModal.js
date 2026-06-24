import React from 'react';

export default function MapModal({ land, onClose }) {
  const lat = land.latitude;
  const lng = land.longitude;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:860,height:'85vh',display:'flex',flexDirection:'column',padding:0}}>
        {/* header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 22px',borderBottom:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
          <div>
            <h2 style={{fontSize:17,fontWeight:700,marginBottom:3}}>🗺️ Land Location</h2>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>{land.title}</p>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.07)',border:'none',color:'rgba(255,255,255,0.6)',width:30,height:30,borderRadius:8,cursor:'pointer',fontSize:14}}>✕</button>
        </div>
        {/* coords bar */}
        <div style={{display:'flex',alignItems:'center',gap:16,padding:'10px 22px',background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13,color:'rgba(255,255,255,0.5)',flexWrap:'wrap',flexShrink:0}}>
          <span>📍 Lat: <b style={{color:'#60a5fa'}}>{Number(lat).toFixed(6)}</b></span>
          <span>📍 Lng: <b style={{color:'#60a5fa'}}>{Number(lng).toFixed(6)}</b></span>
          <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer"
            style={{marginLeft:'auto',background:'#3b82f6',color:'#fff',padding:'5px 14px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'}}>
            Open in Google Maps ↗
          </a>
        </div>
        {/* map */}
        <div style={{flex:1,overflow:'hidden'}}>
          <iframe title="map" src={src} width="100%" height="100%" style={{border:0,display:'block'}} allowFullScreen loading="lazy"/>
        </div>
      </div>
    </div>
  );
}
