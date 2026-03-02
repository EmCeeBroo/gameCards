import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/navbar.css';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">⚔️ Instinto Asesino</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/ranking">Ranking</Link>
        {isAdmin && <Link to="/admin" className="admin-link">🛡️ Admin</Link>}
      </div>
      <div className="navbar-user">
        <span className="username">{user.username}</span>
        {isAdmin && <span className="badge-admin">ADMIN</span>}
        <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>
  );
}
