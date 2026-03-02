import React from 'react';
import '../styles/warrior-card.css';

export function WarriorCard({ warrior, onClick, selected, disabled, showDetails = true }) {
  return (
    <div
      className={`warrior-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onClick?.(warrior)}
    >
      <div className="warrior-card-image">
        <img
          src={`/warriors/${warrior.imageUrl}`}
          alt={warrior.name}
          loading="lazy"
        />
      </div>
      <div className="warrior-card-info">
        <h3 className="warrior-name">{warrior.name}</h3>
        {showDetails && (
          <>
            <span className="warrior-race">{warrior.race?.name}</span>
            <div className="warrior-stats">
              <div className="stat">
                <span className="stat-label">⚡ Poder</span>
                <span className="stat-value">{warrior.power?.value || 0}</span>
                <span className="stat-name">{warrior.power?.type}</span>
              </div>
              <div className="stat">
                <span className="stat-label">✨ Hechizo</span>
                <span className="stat-value">{warrior.spell?.value || 0}</span>
                <span className="stat-name">{warrior.spell?.type}</span>
              </div>
              <div className="stat total">
                <span className="stat-label">🔥 Total</span>
                <span className="stat-value">{(warrior.power?.value || 0) + (warrior.spell?.value || 0)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
