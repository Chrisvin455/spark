import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sparkles, PenTool, LayoutDashboard, User, Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Explore from './pages/Explore';
import './App.css'; 

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply the theme class to the document root element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Sparkles size={24} color="var(--accent-primary)" />
            <span>Spark</span>
          </Link>
          <nav className="nav-links">
            <Link to="/explore" className="nav-item">
              <Sparkles size={18} /> <span>Explore</span>
            </Link>
            <Link to="/generate" className="nav-item">
              <LayoutDashboard size={18} /> <span>Generate</span>
            </Link>
            <Link to="/editor" className="nav-item">
              <PenTool size={18} /> <span>Write</span>
            </Link>
            <Link to="/profile" className="nav-item">
              <User size={18} /> <span>Dashboard</span>
            </Link>
            <Link to="/admin" className="nav-item" style={{ color: '#ef4444' }} title="Admin Only">
              <span>Admin</span>
            </Link>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>

      {/* Floating Theme Toggle (Bottom Left) */}
      <button 
        onClick={toggleTheme} 
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          cursor: 'pointer',
          zIndex: 1000,
          color: 'var(--text-primary)',
          transition: 'all var(--transition-fast)'
        }}
        onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.1)';
           e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'scale(1)';
           e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} color="#eab308" />}
      </button>

    </Router>
  );
}

export default App;
