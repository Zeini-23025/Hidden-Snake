// src/components/HiddenSnake.js

import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [{ x: 9, y: 9 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const HiddenSnake = ({ onClose }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 14, y: 9 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(0.3);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  const getInterval = () => {
    if (speed === 0.1) return 300;
    if (speed === 0.3) return 140;
    if (speed === 0.5) return 80;
    return 140;
  };

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, [snake]);

  useEffect(() => {
    if (gameOver) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }
      const dirs = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      };
      const newDir = dirs[e.key];
      if (newDir && (direction.x !== -newDir.x || direction.y !== -newDir.y)) {
        setDirection(newDir);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [direction, onClose, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const move = () => {
      setSnake(prev => {
        const head = prev[0];
        let newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
        };
        // ✅ Game Over seulement en cas d'auto-collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          setScore(s => s + 10);
          return newSnake;
        }
        return newSnake.slice(0, -1);
      });
    };
    gameLoopRef.current = setInterval(move, getInterval());
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, isPaused, speed, gameOver, generateFood]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 14, y: 9 });
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsPaused(false);
    setGameOver(false);
  };

  const simulateKey = (key) => {
    if (gameOver) return;
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020814',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#a0f0ff',
      zIndex: 9999,
      fontFamily: '"Orbitron", monospace',
      textShadow: '0 0 8px rgba(160, 240, 255, 0.6)'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,0,100,0.3)',
          color: '#ff60a0',
          border: '1px solid #ff60a0',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ✕
      </button>

      <p>Score : <span style={{ color: '#0ff' }}>{score}</span></p>

      {/* ✅ Grille du jeu */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 18px)`,
        gap: '1px',
        background: 'rgba(0,0,0,0.4)',
        padding: '8px',
        margin: '15px',
        border: '2px solid #0af',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 170, 255, 0.5)'
      }}>
        {Array(GRID_SIZE * GRID_SIZE).fill().map((_, i) => {
  const x = i % GRID_SIZE;
  const y = Math.floor(i / GRID_SIZE);
  const isHead = snake[0]?.x === x && snake[0]?.y === y;
  const isBody = snake.slice(1).some(s => s.x === x && s.y === y);
  const isFood = food.x === x && food.y === y;

  let bg = 'transparent';
  let borderRadius = '0';
  if (isHead) {
    bg = '#00ffff';
    borderRadius = '40%';
  } else if (isBody || isFood) {
    bg = '#ff33aa';
    borderRadius = '50%';
  }

  return (
    <div
      key={i}
      style={{
        width: '18px',
        height: '18px',
        background: bg,
        borderRadius: borderRadius,
        boxShadow: isHead ? '0 0 6px #0ff' : (isBody || isFood) ? '0 0 8px #f3a' : 'none'
      }}
    />
  );
})}
        
      </div>

      {/* ✅ GAME OVER dans le cadre du jeu */}
      {gameOver && (
        <div style={{
          marginTop: '15px',
          color: '#ff5555',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          fontFamily: '"Orbitron", monospace',
          textShadow: '0 0 8px rgba(255, 85, 85, 0.7)',
          textAlign: 'center'
        }}>
          💀 GAME OVER
        </div>
      )}

      {/* Boutons tactiles (mobile) */}
      {!gameOver && (
        <div style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '8px' }}>
            <div></div>
            <button onClick={() => simulateKey('ArrowUp')} style={btnStyle}>↑</button>
            <div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '8px' }}>
            <button onClick={() => simulateKey('ArrowLeft')} style={btnStyle}>←</button>
            <button onClick={() => setIsPaused(!isPaused)} style={{
              ...btnStyle,
              background: isPaused ? 'rgba(0,255,100,0.2)' : 'rgba(255,200,0,0.2)',
              color: isPaused ? '#0f0' : '#ffcc00',
              border: `1px solid ${isPaused ? '#0f0' : '#ffcc00'}`
            }}>
              {isPaused ? '▶' : '⏸'}
            </button>
            <button onClick={() => simulateKey('ArrowRight')} style={btnStyle}>→</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '8px' }}>
            <div></div>
            <button onClick={() => simulateKey('ArrowDown')} style={btnStyle}>↓</button>
            <div></div>
          </div>
        </div>
      )}

    {/* Contrôles */}
<div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ff', fontSize: '0.9rem' }}>
    Vitesse :
  </div>
  {/* {[0.1, 0.3, 0.5].map((val) => (
    <button
      key={val}
      onClick={() => !gameOver && setSpeed(val)}
      disabled={gameOver}
      style={{
        padding: '4px 10px',
        background: speed === val ? 'rgba(0,255,255,0.3)' : 'rgba(0,200,255,0.1)',
        color: '#0ff',
        border: '1px solid #0ff',
        borderRadius: '4px',
        cursor: gameOver ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        fontFamily: '"Orbitron", monospace'
      }}
    >
      {val.toString().replace('.', ',')}
    </button>
  ))} */}
  {[0.1, 0.3, 0.5].map((val) => {
  // Définir le texte à afficher en fonction de la valeur de `val`
  let displayText = '';
  if (val === 0.1) {
    displayText = 'x0.5';
  } else if (val === 0.3) {
    displayText = 'x1';
  } else if (val === 0.5) {
    displayText = 'x2';
  }

  return (
    <button
      key={val}
      onClick={() => !gameOver && setSpeed(val)}
      disabled={gameOver}
      style={{
        padding: '4px 10px',
        background: speed === val ? 'rgba(0,255,255,0.3)' : 'rgba(0,200,255,0.1)',
        color: '#0ff',
        border: '1px solid #0ff',
        borderRadius: '4px',
        cursor: gameOver ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        fontFamily: '"Orbitron", monospace'
      }}
    >
      {displayText}
    </button>
  );
})}

  <button
    onClick={resetGame}
    style={{
      padding: '6px 16px',
      background: 'rgba(0,200,255,0.2)',
      color: '#0af',
      border: '1px solid #0af',
      borderRadius: '20px',
      cursor: 'pointer',
      fontFamily: '"Orbitron", monospace',
      marginLeft: '10px'
    }}
  >
    🔄 Restart
  </button>
</div>

      <p style={{ fontSize: '0.9rem', marginTop: '15px', color: '#66aaff' }}>
        Flèches = déplacer • Espace = pause • Échap = quitter
      </p>
    </div>
  );
};

const btnStyle = {
  width: '60px',
  height: '60px',
  background: 'rgba(0, 255, 255, 0.2)',
  color: '#0ff',
  border: '1px solid #0ff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default HiddenSnake;