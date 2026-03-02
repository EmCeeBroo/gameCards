import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import '../styles/auth.css';

export function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength();
  const strengthColor = strengthLevel < 2 ? '#dc3545' : strengthLevel < 4 ? '#ffc107' : '#198754';
  const strengthWidth = `${strengthLevel * 20}%`;
  const strengthLabel = strengthLevel < 2 ? 'Débil' : strengthLevel < 4 ? 'Media' : 'Fuerte';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { username, password });
      navigate('/login', { state: { message: '¡Registro exitoso! Ahora inicia sesión.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>⚔️ Instinto Asesino</h1>
          <p>Crea tu cuenta de guerrero</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Elige tu nombre de guerrero"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div className="strength-bar" style={{ width: strengthWidth, backgroundColor: strengthColor }} />
                <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && password && (
              <div className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}>
                {password === confirmPassword ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
