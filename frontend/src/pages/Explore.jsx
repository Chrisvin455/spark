import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shuffle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Explore() {
  const [prompts, setPrompts] = useState([]);
  const navigate = useNavigate();
  const [params, setParams] = useState({ term: '', genre: 'All', difficulty: 'All' });

  const fetchSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/prompts/search?term=${params.term}&genre=${params.genre}&difficulty=${params.difficulty}`);
      setPrompts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSearch(); }, [params.genre, params.difficulty]);

  const handleRandom = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/prompts/random');
      if (res.data) {
        navigate('/editor', { state: { promptText: res.data.text } });
      }
    } catch(err) { console.error(err); }
  };

  const submitSearch = (e) => { e.preventDefault(); fetchSearch(); };

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <section className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-glass) 0%, transparent 100%)' }}>
        <h1 style={{ marginBottom: '1rem' }}>Explore Categories</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>Dive into our vast database of community-curated challenges and sci-fi twists.</p>
        
        <form onSubmit={submitSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ flex: 2, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}/>
            <input type="text" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="Search keywords..." value={params.term} onChange={e => setParams({...params, term:e.target.value})} />
          </div>
          <select className="form-control" style={{ flex: 1 }} value={params.genre} onChange={e => setParams({...params, genre: e.target.value})}>
            <option>All</option>
            <option>Anti-Gravity or Space</option>
            <option>Sci-Fi</option>
            <option>Fantasy</option>
            <option>Horror</option>
            <option>Romance</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '120px' }}>Search</button>
        </form>
      </section>

      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Filtered Results ({prompts.length})</h2>
        <button onClick={handleRandom} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
          <Shuffle size={16} /> I'm Feeling Lucky
        </button>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {prompts.map(p => (
          <div key={p._id} className="glass-panel hover-bg-glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>{p.genre}</span>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>{p.mood || 'Any'}</span>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '2rem' }}>"{p.text}"</p>
            </div>
            <Link to="/editor" state={{ promptText: p.text }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: '500', fontSize: '0.9rem' }}>
              Write this <ArrowRight size={16} />
            </Link>
          </div>
        ))}
        {prompts.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No prompts found for these filters.</div>}
      </div>

    </motion.div>
  );
}
