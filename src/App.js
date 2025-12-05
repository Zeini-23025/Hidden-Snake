// src/App.js

import React, { useState, useEffect } from 'react';
import HiddenSnake from './components/HiddenSnake';

// 🔐 Code secret personnalisé
const KONAMI_CODE = [
  'o', 'x', 'ArrowUp',
  'o', 'x', 'ArrowDown',
  'ArrowLeft', 'o', 'x', 'ArrowRight'
];

// Détection mobile via largeur d'écran
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function App() {
  const [showSnake, setShowSnake] = useState(false);
  const [progress, setProgress] = useState(0);
  const [glow, setGlow] = useState(false);
  const isMobile = useIsMobile();

  const simulateKey = (key) => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const expected = KONAMI_CODE[progress];
      if (key === expected) {
        const next = progress + 1;
        setProgress(next);
        setGlow(true);
        setTimeout(() => setGlow(false), 300);
        if (next === KONAMI_CODE.length) {
          setShowSnake(true);
          setProgress(0);
        }
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a021a',
      color: '#e0f7ff',
      fontFamily: '"Orbitron", sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Fonds décoratifs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background:
          'radial-gradient(circle at 20% 30%, rgba(0, 80, 150, 0.15), transparent 40%), ' +
          'radial-gradient(circle at 80% 70%, rgba(80, 0, 150, 0.1), transparent 45%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage:
          'radial-gradient(circle, #00ffff 1px, transparent 1px), ' +
          'radial-gradient(circle, #ff00ff 1px, transparent 1px)',
        backgroundSize: '80px 80px, 100px 100px',
        backgroundPosition: '0 0, 40px 40px',
        opacity: 0.07,
        animation: 'drift 35s infinite linear',
        pointerEvents: 'none'
      }} />

      <div style={{
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '800px',
        padding: '0 20px',
        marginBottom: isMobile ? '120px' : '0'
      }}>
        <div style={{
          fontSize: '120px',
          margin: '0 0 20px',
          filter: glow ? 'hue-rotate(90deg) brightness(1.4)' : 'none',
          transition: 'filter 0.3s ease',
          textShadow: glow
            ? '0 0 30px #00ffff, 0 0 60px #0088ff'
            : '0 0 20px rgba(0, 200, 255, 0.6)'
        }}>
          🐍
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          margin: '0 0 15px',
          background: 'linear-gradient(90deg, #00ffff, #0088ff, #8800ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(0, 200, 255, 0.5)',
          letterSpacing: '2px'
        }}>
          HIDDEN SNAKE
        </h1>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          color: '#b0d0ff',
          marginBottom: '20px',
          textShadow: '0 0 8px rgba(100, 200, 255, 0.3)'
        }}>
          {isMobile
            ? 'Utilisez les boutons ci-dessous pour entrer le code.'
            : 'Tapez le code mystère avec votre clavier.'}
        </p>

        <div style={{
          fontSize: '0.9rem',
          color: '#6a90cc',
          fontStyle: 'italic',
          marginTop: '15px',
          opacity: 0.8
        }}>
         <code style={{ color: '#0ff' }}></code>
        </div>
      </div>

      {/* ✅ Clavier virtuel : uniquement sur mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gridTemplateColumns: 'repeat(3, 55px)',
          gap: '6px',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '12px',
          zIndex: 9999,
          boxShadow: '0 0 16px rgba(0, 200, 255, 0.5)'
        }}>
          <button onClick={() => simulateKey('o')} style={btnStyle}>o</button>
          <button onClick={() => simulateKey('x')} style={btnStyle}>x</button>
          <button onClick={() => simulateKey('ArrowUp')} style={btnStyle}>↑</button>
          <button onClick={() => simulateKey('ArrowLeft')} style={btnStyle}>←</button>
          <button onClick={() => simulateKey('ArrowDown')} style={btnStyle}>↓</button>
          <button onClick={() => simulateKey('ArrowRight')} style={btnStyle}>→</button>
        </div>
      )}

      {showSnake && <HiddenSnake onClose={() => setShowSnake(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&display=swap');
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-20px, -20px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const btnStyle = {
  width: '55px',
  height: '55px',
  background: 'rgba(0, 255, 255, 0.2)',
  color: '#0ff',
  border: '1px solid #0ff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default App;