import { useState } from 'react';
import { Zap, RefreshCw, BookmarkPlus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Generator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [formData, setFormData] = useState({
    genre: 'Sci-Fi',
    mood: 'Dark',
    difficulty: 'Medium',
    twist: 'Anti-Gravity or Space'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/prompts/generate', formData);
      setPrompt(res.data);
      setIsFavorited(false);
    } catch (err) {
      console.error(err);
      // Fallback for UI visualization if backend is disconnected or errors out
      setPrompt({
        text: "You wake up floating three feet above your bed. The news says gravitational anomalies are hitting random neighborhoods. You have a job interview in an hour, and you can't touch the ground.",
        genre: formData.genre,
        mood: formData.mood
      });
    }
    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!prompt || !prompt._id) return alert("Cannot favorite a fallback prompt");
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/auth');
      await axios.post('http://localhost:5000/api/auth/favorites', { promptId: prompt._id }, { headers: { Authorization: `Bearer ${token}` } });
      setIsFavorited(!isFavorited);
    } catch (err) {
      alert("Failed to save favorite.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
      
      {/* Controls Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap color="var(--accent-primary)" /> Prompt Engine
        </h2>
        
        <form onSubmit={handleGenerate}>
          <div className="input-group">
            <label className="input-label">Genre</label>
            <select className="form-control" name="genre" value={formData.genre} onChange={handleChange}>
              <option>Sci-Fi</option>
              <option>Fantasy</option>
              <option>Horror</option>
              <option>Romance</option>
              <option>Mystery</option>
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">Mood</label>
            <select className="form-control" name="mood" value={formData.mood} onChange={handleChange}>
              <option>Dark</option>
              <option>Happy</option>
              <option>Emotional</option>
              <option>Funny</option>
              <option>Suspenseful</option>
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">Difficulty</label>
            <select className="form-control" name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">Special Twist / Concept</label>
            <input type="text" className="form-control" name="twist" value={formData.twist} onChange={handleChange} placeholder="e.g. Time loop, parallel universe" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <RefreshCw className="spin" /> : 'Generate Prototype'}
          </button>
        </form>
      </div>

      {/* Result Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {prompt ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem', position: 'relative', border: '1px solid var(--accent-primary)', boxShadow: 'var(--shadow-glow)' }}>
             <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>{prompt.genre}</span>
                <span style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>{prompt.mood}</span>
             </div>
             <p style={{ fontSize: '1.3rem', color: 'white', lineHeight: '1.8' }}>
               "{prompt.text}"
             </p>
             <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/editor', { state: { promptText: prompt.text }})}>Start Writing</button>
                <button className="btn btn-secondary" title="Save to Favorites" onClick={toggleFavorite}>
                  <BookmarkPlus color={isFavorited ? "var(--accent-primary)" : "currentColor"} /> 
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
             </div>
          </div>
        ) : (
           <div className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', opacity: 0.5 }}>
             <p>Configure parameters and hit generate to see magic.</p>
           </div>
        )}
      </div>
      
    </div>
  );
}
