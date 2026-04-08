import { Sparkles, ArrowRight, BrainCircuit, TrendingUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [dailyPrompt, setDailyPrompt] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/prompts/daily`).then(res => setDailyPrompt(res.data)).catch(console.error);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingTop: '3rem' }}>
      
      {/* SaaS Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.8rem', alignItems: 'center' }}>
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }} 
           animate={{ opacity: 1, scale: 1 }} 
           transition={{ duration: 0.5 }}
           style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-glass)', padding: '0.5rem 1.2rem', borderRadius: '50px', border: '1px solid var(--border-subtle)' }}
        >
          <Sparkles size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Introducing Spark</span>
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.6, delay: 0.1 }}
           style={{ fontSize: 'clamp(3.5rem, 7vw, 5rem)', letterSpacing: '-0.03em', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.1' }}
        >
          Never face a blank <br/> page again.
        </motion.h1>
        
        <motion.p 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           transition={{ duration: 0.6, delay: 0.2 }}
           style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '600px' }}
        >
          Harness the power of personalized AI to generate completely unique, data-driven writing prompts. Collaborate in real-time and track your novel's progress.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, y: 10 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.6, delay: 0.3 }}
           style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}
        >
          <Link to="/generate" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
            Start Generating <ArrowRight size={20} />
          </Link>
          <button className="btn btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
            View Showcase
          </button>
        </motion.div>
      </section>

      {/* Discovery Hub (Trending & For You) */}
      <motion.section 
         initial={{ opacity: 0 }} 
         whileInView={{ opacity: 1 }} 
         viewport={{ once: true }}
         style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}
      >
        
        {/* For You / Daily AI */}
        <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-glow)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
            <BrainCircuit size={24} /> Recommended For You (Daily)
          </h3>
          <p style={{ fontSize: '1.4rem', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            "{dailyPrompt?.text || "In a completely frictionless, zero-gravity domed city on Mars, a detective is chasing a thief who has stolen the only object that anchors people to the ground: a 100-year-old lead paperweight."}"
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <Link to="/editor" state={{ promptText: dailyPrompt?.text || "In a completely frictionless, zero-gravity domed city on Mars, a detective is chasing a thief..." }} className="btn btn-primary">Start Writing</Link>
          </div>
        </div>

        {/* Trending Community */}
        <div className="glass-panel" style={{ padding: '3rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            <TrendingUp size={24} color="#10b981" /> Trending Concepts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {[
               { id: 1, text: "A time-traveler keeps going back to save their partner, but every attempt creates a worse timeline.", likes: "12k", genre: "Sci-Fi" },
               { id: 2, text: "Everyone is born with a timer on their wrist counting down to the day they meet their soulmate.", likes: "9.4k", genre: "Romance" },
               { id: 3, text: "A fantasy realm where magic is powered by the stock market.", likes: "5.1k", genre: "Fantasy" }
             ].map(prompt => (
               <div key={prompt.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                 <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>"{prompt.text}"</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                   <span>{prompt.genre}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Sparkles size={14} color="#eab308"/> {prompt.likes}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

      </motion.section>
      
    </div>
  );
}
