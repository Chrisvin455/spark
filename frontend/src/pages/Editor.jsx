import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Save, FileCheck2, Users, Crown } from 'lucide-react';
import { io } from 'socket.io-client';

export default function Editor() {
  const location = useLocation();
  const initPrompt = location.state?.promptText || "Write whatever flows into your mind...";
  
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [collabUsers, setCollabUsers] = useState(1);
  const socketRef = useRef(null);
  
  // Real-time socket sync
  useEffect(() => {
    // In production, we'd use a unique doc ID from the URL params
    const documentId = 'demo-collab-room'; 
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-document', documentId);
    });

    socketRef.current.on('receive-changes', (newContent) => {
      setContent(newContent);
    });

    // Mock presence logic
    setInterval(() => {
      // In a real app we'd receive socket events for join/leave
      // setCollabUsers(usersInRoom)
    }, 5000);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    
    // Broadcast changes to peers immediately
    if (socketRef.current) {
      socketRef.current.emit('send-changes', { documentId: 'demo-collab-room', content: val });
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSave = async () => {
    setIsSaved(true);
    // In a real app, send actual word counts to analytics API
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics/sync-words`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ wordsAdded: wordCount })
        });
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid var(--border-focus)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
             <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Prompt</h4>
             <p style={{ fontSize: '1.1rem', color: '#fff' }}>{initPrompt}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '50px', border: '1px solid var(--border-subtle)' }}>
             <Users size={16} color="var(--accent-secondary)" />
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{collabUsers} Editor(s)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{wordCount} words</span>
          {wordCount > 500 && <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', color: '#eab308', fontSize: '0.8rem' }}><Crown size={14}/> Zone Entered</span>}
        </div>
        <button onClick={handleSave} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          {isSaved ? <><FileCheck2 size={16} color="#10b981"/> Cloud Synced</> : <><Save size={16} /> Save</>}
        </button>
      </div>

      <textarea 
        className="form-control" 
        style={{ 
          width: '100%', 
          minHeight: '65vh', 
          resize: 'vertical', 
          backgroundColor: 'transparent',
          border: 'none',
          borderLeft: '2px solid var(--border-subtle)',
          borderRadius: '0',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          lineHeight: '1.8'
        }}
        placeholder="Start your masterpiece here... changes are synced in real-time."
        value={content}
        onChange={handleChange}
      ></textarea>
    </div>
  );
}
