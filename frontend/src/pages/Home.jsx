import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/home.css';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    navigate(`/select/${mode}`);
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="title-animated">
          {'Instinto Asesino'.split('').map((char, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <p className="subtitle">Bienvenido, <strong>{user?.username}</strong>. Elige tu destino.</p>
      </div>

      <div className="mode-selection">
        <h2>Selecciona el tipo de combate</h2>
        <div className="mode-buttons">
          <button className="mode-btn" onClick={() => handleModeSelect('1v1')}>
            <span className="mode-icon">⚔️</span>
            <span className="mode-label">1 vs 1</span>
            <span className="mode-desc">Duelo directo</span>
          </button>
          <button className="mode-btn" onClick={() => handleModeSelect('3v3')}>
            <span className="mode-icon">🗡️</span>
            <span className="mode-label">3 vs 3</span>
            <span className="mode-desc">Escuadrón táctico</span>
          </button>
          <button className="mode-btn featured" onClick={() => handleModeSelect('5v5')}>
            <span className="mode-icon">⚡</span>
            <span className="mode-label">5 vs 5</span>
            <span className="mode-desc">La Masacre</span>
          </button>
        </div>
      </div>
    </div>
  );
}
