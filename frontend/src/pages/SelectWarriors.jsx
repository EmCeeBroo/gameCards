import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { WarriorCard } from '../components/WarriorCard';
import '../styles/select-warrior.css';

export function SelectWarriors() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const maxCards = mode === '1v1' ? 1 : mode === '3v3' ? 3 : 5;

  const [warriors, setWarriors] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(1);
  const [selections, setSelections] = useState({ 1: [], 2: [] });
  const [player2Name, setPlayer2Name] = useState('Invitado');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWarriors();
  }, []);

  const loadWarriors = async () => {
    try {
      const data = await api.get('/warriors');
      setWarriors(data);
    } catch (err) {
      setError('Error al cargar guerreros');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (warrior) => {
    const playerSelections = selections[selectedPlayer];
    const otherPlayer = selectedPlayer === 1 ? 2 : 1;
    const otherPlayerSelections = selections[otherPlayer];
    
    // Check if already selected by this player
    if (playerSelections.find(w => w.id === warrior.id)) {
      // Deselect
      setSelections({
        ...selections,
        [selectedPlayer]: playerSelections.filter(w => w.id !== warrior.id),
      });
      return;
    }

    // Check if already selected by the other player
    if (otherPlayerSelections.find(w => w.id === warrior.id)) {
      setError(`Este guerrero ya fue seleccionado por el Jugador ${otherPlayer}`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (playerSelections.length >= maxCards) {
      return;
    }

    setSelections({
      ...selections,
      [selectedPlayer]: [...playerSelections, warrior],
    });
  };

  const isSelected = (warrior) => {
    return selections[1].some(w => w.id === warrior.id) || selections[2].some(w => w.id === warrior.id);
  };

  const isSelectedByOtherPlayer = (warrior) => {
    const otherPlayer = selectedPlayer === 1 ? 2 : 1;
    return selections[otherPlayer].some(w => w.id === warrior.id);
  };

  const isSelectedByCurrentPlayer = (warrior) => {
    return selections[selectedPlayer].some(w => w.id === warrior.id);
  };

  const handleStartBattle = () => {
    if (selections[1].length !== maxCards || selections[2].length !== maxCards) {
      return;
    }
    // Store selections and navigate to battle
    localStorage.setItem('battleSelections', JSON.stringify({
      mode,
      player1: selections[1],
      player2: selections[2],
      player2Name: player2Name.trim() || 'Invitado',
    }));
    navigate('/battle');
  };

  const handleReset = () => {
    setSelections({ 1: [], 2: [] });
    setSelectedPlayer(1);
  };

  const player1Ready = selections[1].length === maxCards;
  const player2Ready = selections[2].length === maxCards;
  const allReady = player1Ready && player2Ready;

  if (loading) return <div className="loading">Cargando guerreros...</div>;

  return (
    <div className="select-container">
      <h1>⚔️ Selección de Guerreros — {mode.toUpperCase()}</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="player-toggle">
        <button
          className={`toggle-btn ${selectedPlayer === 1 ? 'active' : ''}`}
          onClick={() => setSelectedPlayer(1)}
        >
          Jugador 1 ({selections[1].length}/{maxCards})
        </button>
        <button
          className={`toggle-btn ${selectedPlayer === 2 ? 'active' : ''}`}
          onClick={() => setSelectedPlayer(2)}
        >
          {player2Name || 'Jugador 2'} ({selections[2].length}/{maxCards})
        </button>
      </div>

      {selectedPlayer === 2 && (
        <div className="player2-name-input">
          <label htmlFor="player2Name">Nombre del Jugador 2:</label>
          <input
            id="player2Name"
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Escribe el nombre del Jugador 2"
            maxLength={20}
          />
        </div>
      )}

      <div className="selection-area">
        <div className="selected-warriors">
          <div className="player-selections">
            <h3>Jugador 1</h3>
            <div className="selected-slots">
              {Array.from({ length: maxCards }).map((_, i) => (
                <div key={i} className={`slot ${selections[1][i] ? 'filled' : ''}`}>
                  {selections[1][i] ? (
                    <WarriorCard warrior={selections[1][i]} showDetails={false} onClick={() => {
                      if (selectedPlayer === 1) {
                        setSelections({
                          ...selections,
                          1: selections[1].filter((_, idx) => idx !== i),
                        });
                      }
                    }} />
                  ) : (
                    <span className="empty-slot">?</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="vs-divider">VS</div>

          <div className="player-selections">
            <h3>Jugador 2</h3>
            <div className="selected-slots">
              {Array.from({ length: maxCards }).map((_, i) => (
                <div key={i} className={`slot ${selections[2][i] ? 'filled' : ''}`}>
                  {selections[2][i] ? (
                    <WarriorCard warrior={selections[2][i]} showDetails={false} onClick={() => {
                      if (selectedPlayer === 2) {
                        setSelections({
                          ...selections,
                          2: selections[2].filter((_, idx) => idx !== i),
                        });
                      }
                    }} />
                  ) : (
                    <span className="empty-slot">?</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="available-warriors">
        <h3>Elige tus Asesinos</h3>
        <div className="warriors-grid">
          {warriors.map(warrior => (
            <WarriorCard
              key={warrior.id}
              warrior={warrior}
              selected={isSelectedByCurrentPlayer(warrior)}
              disabled={isSelected(warrior) && !isSelectedByCurrentPlayer(warrior)}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={handleReset}>🔄 Reiniciar Selección</button>
        <button
          className="btn-battle"
          disabled={!allReady}
          onClick={handleStartBattle}
        >
          ⚔️ ¡Iniciar Masacre!
        </button>
      </div>
    </div>
  );
}
