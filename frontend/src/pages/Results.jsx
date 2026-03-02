import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WarriorCard } from '../components/WarriorCard';
import '../styles/results.css';

export function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.battleResult) {
    return (
      <div className="results-container">
        <h2>No hay resultados disponibles.</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al Inicio</button>
      </div>
    );
  }

  const { battleResult, battleData } = state;

  return (
    <div className="results-container">
      <div className={`results-header ${battleResult.isDraw ? 'draw' : 'victory'}`}>
        <h1>{battleResult.isDraw ? '🤝 ¡Empate!' : `🏆 ¡${battleResult.winner} ha ganado!`}</h1>
        <p className="result-reason">
          {battleResult.player1Total} pts vs {battleResult.player2Total} pts
        </p>
      </div>

      <div className="results-detail">
        <div className="result-team">
          <h3>Jugador 1 — {battleResult.player1Total} pts</h3>
          <div className="result-warriors">
            {battleResult.player1Warriors.map(warrior => (
              <div key={warrior.id} className="result-warrior">
                <WarriorCard warrior={warrior} />
              </div>
            ))}
          </div>
        </div>

        <div className="result-team">
          <h3>Jugador 2 — {battleResult.player2Total} pts</h3>
          <div className="result-warriors">
            {battleResult.player2Warriors.map(warrior => (
              <div key={warrior.id} className="result-warrior">
                <WarriorCard warrior={warrior} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={() => navigate('/')}>🏠 Volver al Inicio</button>
        <button className="btn-secondary" onClick={() => navigate('/ranking')}>🏆 Ver Ranking</button>
      </div>
    </div>
  );
}
