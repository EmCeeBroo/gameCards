import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import '../styles/ranking.css';

export function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const data = await api.get('/ranking');
      setRanking(data);
    } catch (error) {
      console.error('Error loading ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando ranking...</div>;

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="ranking-container">
      <h1>🏆 Ranking de Guerreros</h1>

      {ranking.length === 0 ? (
        <div className="empty-ranking">
          <p>Aún no hay partidas registradas. ¡Sé el primero en jugar!</p>
        </div>
      ) : (
        <div className="ranking-table-wrapper">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Jugador</th>
                <th>Victorias</th>
                <th>Derrotas</th>
                <th>Empates</th>
                <th>Total</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player, index) => (
                <tr key={player.id} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="position">{getMedal(index)}</td>
                  <td className="username">{player.username}</td>
                  <td className="wins">{player.wins}</td>
                  <td className="losses">{player.losses}</td>
                  <td className="draws">{player.draws}</td>
                  <td>{player.totalMatches}</td>
                  <td>
                    <div className="winrate-bar">
                      <div className="winrate-fill" style={{ width: `${player.winRate}%` }} />
                      <span>{player.winRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
