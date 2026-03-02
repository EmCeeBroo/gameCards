import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { WarriorCard } from '../components/WarriorCard';
import '../styles/battle.css';

export function Battle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [battleData, setBattleData] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [fighting, setFighting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('battleSelections');
    if (!stored) {
      navigate('/');
      return;
    }
    setBattleData(JSON.parse(stored));
  }, []);

  const startBattle = async () => {
    setFighting(true);
    setShowResult(false);

    try {
      // Validar datos antes de enviar
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado correctamente');
      }

      if (!battleData || !battleData.mode) {
        throw new Error('Modo de batalla no definido');
      }

      // Convertir modo al formato esperado por el backend
      const modeMap = {
        '1v1': 'ONE_VS_ONE',
        '3v3': 'THREE_VS_THREE',
        '5v5': 'FIVE_VS_FIVE'
      };

      const backendMode = modeMap[battleData.mode] || 'FIVE_VS_FIVE';

      console.log('Creando partida con:', {
        player1Id: user.id,
        player2Id: null, // Guest mode
        mode: backendMode
      });

      // Create match via API (Player 2 is null for Guest/Local mode)
      const matchResult = await api.post('/matches', {
        player1Id: user.id,
        player2Id: null, // Invited/Guest mode
        mode: backendMode,
        player2Name: battleData.player2Name || 'Invitado',
      });

      const matchId = matchResult.data.id;

      // Save selections for player 1
      await api.post(`/matches/${matchId}/selections`, {
        warriorIds: battleData.player1.map(w => w.id),
        playerSlot: 1
      });

      // Save selections for player 2 (mismo usuario en juego local)
      await api.post(`/matches/${matchId}/selections`, {
        warriorIds: battleData.player2.map(w => w.id),
        playerSlot: 2
      });

      // Animate rounds
      const maxRounds = battleData.player1.length;
      for (let i = 0; i < maxRounds; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentRound(i + 1);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate winner on backend and finish match
      const battleResponse = await api.post(`/matches/${matchId}/battle`);
      const battleData_result = battleResponse.data;

      const result = {
        player1Total: battleData_result.player1.total,
        player2Total: battleData_result.player2.total,
        winner: battleData_result.result === 'player1' ? 'Jugador 1' : 
                battleData_result.result === 'player2' ? 'Jugador 2' : 'Empate',
        isDraw: battleData_result.result === 'draw',
        player1Warriors: battleData.player1,
        player2Warriors: battleData.player2,
        reason: battleData_result.reason,
      };

      setBattleResult(result);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setFighting(false);
    }
  };

  const handlePlayAgain = () => {
    localStorage.removeItem('battleSelections');
    navigate('/');
  };

  const handleViewResults = () => {
    navigate('/results', { state: { battleResult, battleData } });
  };

  if (!battleData) return null;

  return (
    <div className="battle-container">
      <h1 className="battle-title">
        {'La masacre está por comenzar'.split('').map((char, i) => (
          <span key={i} className="title-char" style={{ animationDelay: `${i * 0.04}s` }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {error && <div className="error-message">{error}</div>}

      <div className="battle-arena">
        <div className="battle-side player1-side player1-theme">
          <div className="side-header">
            <h3>Jugador 1</h3>
            <span className="player-badge">TU</span>
          </div>
          <div className="battle-cards">
            {battleData.player1.map((warrior, i) => (
              <div key={warrior.id} className={`battle-card-wrapper ${currentRound > i ? 'revealed' : ''}`}>
                <WarriorCard warrior={warrior} showDetails={false} />
                {currentRound > i && (
                  <div className="card-score">
                    {(warrior.power?.value || 0) + (warrior.spell?.value || 0)}
                  </div>
                )}
              </div>
            ))}
          </div>
          {showResult && <div className="total-score">Total: {battleResult.player1Total}</div>}
        </div>

        <div className="battle-center">
          {fighting && <div className="battle-animation">⚔️</div>}
          {showResult && (
            <div className={`result-badge ${battleResult.isDraw ? 'draw' : 'victory'}`}>
              {battleResult.isDraw ? '🤝 EMPATE' : `🏆 ${battleResult.winner} GANA!`}
            </div>
          )}
          {!fighting && !showResult && (
            <button className="btn-battle-start" onClick={startBattle}>
              ⚔️ ¡LUCHAR!
            </button>
          )}
        </div>

        <div className="battle-side player2-side player2-theme">
          <div className="side-header">
            <h3>{battleData.player2Name || 'Jugador 2'}</h3>
            <span className="player-badge">{(battleData.player2Name || 'INV').substring(0, 5).toUpperCase()}</span>
          </div>
          <div className="battle-cards">
            {battleData.player2.map((warrior, i) => (
              <div key={warrior.id} className={`battle-card-wrapper ${currentRound > i ? 'revealed' : ''}`}>
                <WarriorCard warrior={warrior} showDetails={false} />
                {currentRound > i && (
                  <div className="card-score">
                    {(warrior.power?.value || 0) + (warrior.spell?.value || 0)}
                  </div>
                )}
              </div>
            ))}
          </div>
          {showResult && <div className="total-score">Total: {battleResult.player2Total}</div>}
        </div>
      </div>

      {showResult && (
        <div className="battle-actions">
          <button className="btn-secondary" onClick={handlePlayAgain}>🏠 Jugar de Nuevo</button>
          <button className="btn-primary" onClick={handleViewResults}>📊 Ver Detalles</button>
        </div>
      )}
    </div>
  );
}
