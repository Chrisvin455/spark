import { useState, useEffect } from 'react';
import { Flame, Trophy, Star, BookOpen, PenTool, Hash } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

// Mock data to demonstrate chart when backend falls back
const backupData = [
  { name: 'Mon', words: 400 }, { name: 'Tue', words: 300 },
  { name: 'Wed', words: 1200 }, { name: 'Thu', words: 800 },
  { name: 'Fri', words: 50 }, { name: 'Sat', words: 2000 },
  { name: 'Sun', words: 1500 }
];

export default function Profile() {
  const [data, setData] = useState({
    level: 1, streak: 3, points: 420, badges: [], totalWordsWritten: 5000, writingHistory: []
  });

  useEffect(() => {
    // In actual app, fetch from /api/analytics/stats using JWT
    // Here we assume it's prefilled with dummy/mock SaaS level data
  }, []);

  const chartData = data.writingHistory.length > 0 
    ? data.writingHistory.map(log => ({ name: new Date(log.date).getDate(), words: log.wordsAdded }))
    : backupData;

  const getBadgeColor = (name) => {
    if (name.includes('Wordsmith')) return '#3b82f6';
    if (name.includes('Streak')) return '#ef4444';
    return 'var(--accent-primary)';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
      
      {/* Sidebar Profile Info */}
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
            J
          </div>
          <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--bg-primary)', border: '2px solid var(--accent-primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {data.level}
          </div>
        </div>
        <h2>John_Writer</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Novelist • Lvl {data.level}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <Flame color="#ef4444" size={20} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{data.streak}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Streak</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <PenTool color="#10b981" size={20} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{(data.totalWordsWritten/1000).toFixed(1)}k</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Words</div>
          </div>
        </div>

        {/* Badges Section */}
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ACHIEVEMENTS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['First Draft', '3-Day Streak', 'Sci-Fi Fanatic'].map((badge, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <Trophy size={16} color={getBadgeColor(badge)} />
                <span style={{ fontSize: '0.9rem' }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Analytics Chart */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Hash color="var(--accent-secondary)" /> Productivity Engine
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="words" stroke="var(--accent-secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--accent-primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Saved Items */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><BookOpen color="var(--accent-primary)" /> Vault</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-bg-glass">
              "You discover your reflections in mirrors are a few seconds behind you."
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fiction • Suspense</div>
            </div>
            <div style={{ padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-secondary)' }}>
              "Mankind didn't invent FTL travel. We just realized the universe is a lot smaller than we thought, and we were looking at it wrong."
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Sci-Fi • Mind-bending</div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
