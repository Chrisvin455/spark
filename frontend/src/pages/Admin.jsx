import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Plus, Trash, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: '', genre: 'Anti-Gravity or Space', mood: 'Dark', difficulty: 'Medium' });

  const fetchPrompts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/prompts/search?term=');
      setPrompts(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPrompts(); }, []);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/prompts/admin', form, config);
      setForm({ text: '', genre: 'Anti-Gravity or Space', mood: 'Dark', difficulty: 'Medium' });
      fetchPrompts();
    } catch (err) { alert('Admin creation failed: ' + (err.response?.data?.error || err.message)); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/prompts/admin/${id}`, config);
      fetchPrompts();
    } catch (err) { alert('Delete failed'); }
  };

  const setDaily = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/prompts/admin/${id}/set-daily`, {}, config);
      fetchPrompts();
    } catch (err) { alert('Set daily failed'); }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)' }}>
        <ShieldAlert color="#ef4444" />
        <h2 style={{ color: '#ef4444', fontSize: '1.2rem', margin: 0 }}>Administrator Control Panel</h2>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18} /> Add Curated Prompt</h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div style={{ gridColumn: '1 / -1' }} className="input-group">
            <label className="input-label">Prompt Content</label>
            <textarea required value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="form-control" style={{ minHeight: '80px' }}></textarea>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Category</label>
            <input required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} className="form-control" />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Mood</label>
            <input required value={form.mood} onChange={e => setForm({...form, mood: e.target.value})} className="form-control" />
          </div>
          <button className="btn btn-primary" type="submit">Create Root Prompt</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={18} /> Manage Database</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? <p>Loading registry...</p> : prompts.map(p => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: p.isDaily ? '4px solid #eab308' : '4px solid transparent' }}>
              <div style={{ maxWidth: '70%' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{p.text}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.genre} • {p.mood} {p.isDaily && <span style={{color: '#eab308', marginLeft:'0.5rem'}}>★ Current Daily</span>}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setDaily(p._id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} title="Make Daily Prompt"><Star size={14} /></button>
                <button onClick={() => handleDelete(p._id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }} title="Delete"><Trash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
