import React, { useState } from 'react';
import api from '../utils/api';
import './LandForm.css';

const empty = {
  title:'', owner_name:'', village:'', mandal:'', district:'', state:'',
  survey_number:'', total_area:'', price:'', description:'',
  contact_number:'', latitude:'', longitude:''
};

export default function LandForm({ title, land, onClose, onSuccess }) {
  const editing = !!land;
  const [form, setForm] = useState(editing ? {
    title:          land.title          || '',
    owner_name:     land.owner_name     || '',
    village:        land.village        || '',
    mandal:         land.mandal         || '',
    district:       land.district       || '',
    state:          land.state          || '',
    survey_number:  land.survey_number  || '',
    total_area:     land.total_area     || '',
    price:          land.price          || '',
    description:    land.description    || '',
    contact_number: land.contact_number || '',
    latitude:       land.latitude       || '',
    longitude:      land.longitude      || ''
  } : empty);

  const [files,    setFiles]    = useState([]);
  const [previews, setPreviews] = useState(editing ? (land.images||[]) : []);
  const [busy,     setBusy]     = useState(false);
  const [err,      setErr]      = useState('');

  const set = k => e => setForm({...form,[k]:e.target.value});

  const onFiles = e => {
    const arr = Array.from(e.target.files);
    setFiles(arr);
    setPreviews(arr.map(f=>URL.createObjectURL(f)));
  };

  const submit = async e => {
    e.preventDefault(); setErr('');
    if(!form.title.trim())      return setErr('Land title is required');
    if(!form.owner_name.trim()) return setErr('Owner name is required');
    if(!form.price)             return setErr('Price is required');

    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>{ if(v!=='') fd.append(k,v); });
      files.forEach(f=>fd.append('images',f));

      if(editing) {
        await api.put(`/lands/update/${land.id}`, fd, {headers:{'Content-Type':'multipart/form-data'}});
      } else {
        await api.post('/lands/add', fd, {headers:{'Content-Type':'multipart/form-data'}});
      }
      onSuccess();
    } catch(e) {
      setErr(e.response?.data?.message || 'Save failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal lf-modal">
        {/* Header */}
        <div className="lf-head">
          <h2>{editing?'✏️':'🏞️'} {title}</h2>
          <button className="lf-close" onClick={onClose}>✕</button>
        </div>

        {err && <div className="err-box" style={{margin:'0 24px 4px'}}>{err}</div>}

        <form onSubmit={submit} className="lf-form">

          {/* Section 1 */}
          <div className="lf-section">
            <div className="lf-sec-title">📋 Basic Info</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Land Title *</label>
                <input className="form-input" placeholder="e.g. Agricultural Land in Karimnagar" value={form.title} onChange={set('title')} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input className="form-input" placeholder="Full owner name" value={form.owner_name} onChange={set('owner_name')} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Survey Number</label>
                <input className="form-input" placeholder="e.g. 123/A" value={form.survey_number} onChange={set('survey_number')}/>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.contact_number} onChange={set('contact_number')}/>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lf-section">
            <div className="lf-sec-title">📍 Location</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Village</label>
                <input className="form-input" placeholder="Village name" value={form.village} onChange={set('village')}/>
              </div>
              <div className="form-group">
                <label className="form-label">Mandal</label>
                <input className="form-input" placeholder="Mandal name" value={form.mandal} onChange={set('mandal')}/>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input className="form-input" placeholder="District name" value={form.district} onChange={set('district')}/>
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" placeholder="e.g. Telangana" value={form.state} onChange={set('state')}/>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="lf-section">
            <div className="lf-sec-title">💰 Price & Details</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Total Area (Acres) *</label>
                <input className="form-input" type="number" step="0.01" min="0" placeholder="e.g. 2.5" value={form.total_area} onChange={set('total_area')} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" min="0" placeholder="e.g. 500000" value={form.price} onChange={set('price')} required/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Describe the land — soil type, water source, road access..." value={form.description} onChange={set('description')} rows={3}/>
            </div>
          </div>

          {/* Section 4 */}
          <div className="lf-section">
            <div className="lf-sec-title">🗺️ GPS Coordinates (optional)</div>
            <div className="grid2">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input className="form-input" type="number" step="any" placeholder="e.g. 17.385044" value={form.latitude} onChange={set('latitude')}/>
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input className="form-input" type="number" step="any" placeholder="e.g. 78.486671" value={form.longitude} onChange={set('longitude')}/>
              </div>
            </div>
            <p className="lf-hint">💡 Go to <a href="https://maps.google.com" target="_blank" rel="noreferrer">maps.google.com</a> → right-click on location → copy coordinates</p>
          </div>

          {/* Section 5 */}
          <div className="lf-section">
            <div className="lf-sec-title">📸 Photos {editing&&'(upload new to replace)'}</div>
            <div className="lf-upload" onClick={()=>document.getElementById('lf-file').click()}>
              <input id="lf-file" type="file" multiple accept="image/*" hidden onChange={onFiles}/>
              {previews.length > 0 ? (
                <div className="lf-previews">
                  {previews.map((p,i)=>(
                    <img key={i} src={p.startsWith('blob:')?p:`http://localhost:5000/uploads/${p}`} alt="" className="lf-prev-img"/>
                  ))}
                  <div className="lf-add-more">+ Add</div>
                </div>
              ) : (
                <div className="lf-placeholder">
                  <span>📁</span>
                  <p>Click to upload photos</p>
                  <small>JPG, PNG — up to 10 images, 10MB each</small>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="lf-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <><span className="spinner"/> Saving...</> : (editing ? '✓ Save Changes' : '✓ Add Land')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
