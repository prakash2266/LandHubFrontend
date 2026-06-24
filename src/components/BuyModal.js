import React, { useState } from 'react';
import api from '../utils/api';

export default function BuyModal({ land, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  const confirm = async () => {
    setBusy(true); setErr('');
    try {
      await api.post(`/lands/purchase/${land.id}`);
      onSuccess();
    } catch(e) {
      setErr(e.response?.data?.message || 'Purchase failed');
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-sm" style={{padding:'36px 32px',textAlign:'center'}}>
        <div style={{fontSize:56,marginBottom:14,animation:'pulse 2s infinite'}}>🏡</div>
        <h2 style={{fontFamily:'Poppins',fontSize:22,marginBottom:8}}>Confirm Purchase</h2>
        <p style={{color:'rgba(255,255,255,0.55)',fontSize:14,marginBottom:22}}>Are you sure you want to buy this land?</p>

        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'18px 20px',marginBottom:20,textAlign:'left'}}>
          {[
            ['Property', land.title],
            ['Owner',    land.owner_name],
            ['Location', [land.village,land.district,land.state].filter(Boolean).join(', ')||'N/A'],
            ['Area',     `${land.total_area} Acres`],
            ['Seller',   land.seller_name],
          ].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:14}}>
              <span style={{color:'rgba(255,255,255,0.45)'}}>{k}</span>
              <span style={{fontWeight:500,textAlign:'right',maxWidth:'60%'}}>{v}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 0',fontSize:16}}>
            <span style={{fontWeight:600,color:'rgba(255,255,255,0.7)'}}>Total Price</span>
            <span style={{fontWeight:700,fontSize:20,color:'#14b8a6'}}>₹ {Number(land.price).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {err && <div className="err-box" style={{marginBottom:16,textAlign:'left'}}>⚠️ {err}</div>}

        <p style={{fontSize:12,color:'rgba(245,158,11,0.7)',marginBottom:22,textAlign:'left'}}>
          ⚠️ This action is final. Land status will change to "Sold" immediately.
        </p>

        <div style={{display:'flex',gap:12}}>
          <button className="btn btn-ghost" style={{flex:1,padding:'13px'}} onClick={onClose} disabled={busy}>No, Cancel</button>
          <button className="btn btn-teal" style={{flex:1,padding:'13px'}} onClick={confirm} disabled={busy}>
            {busy ? <><span className="spinner"/> Processing...</> : '✓ Yes, Buy Now!'}
          </button>
        </div>
      </div>
    </div>
  );
}
