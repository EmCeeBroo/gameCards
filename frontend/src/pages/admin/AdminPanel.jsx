import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import '../../styles/admin.css';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [warriors, setWarriors] = useState([]);
  const [users, setUsers] = useState([]);
  const [races, setRaces] = useState([]);
  const [powers, setPowers] = useState([]);
  const [spells, setSpells] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [warriorForm, setWarriorForm] = useState({ name: '', raceId: '', powerId: '', spellId: '', imageUrl: '', description: '' });
  const [raceForm, setRaceForm] = useState({ name: '', description: '' });
  const [powerForm, setPowerForm] = useState({ type: '', value: '' });
  const [spellForm, setSpellForm] = useState({ type: '', value: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const loadData = async (tab) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'stats':
          setStats(await api.get('/admin/stats'));
          break;
        case 'warriors':
          setWarriors(await api.get('/warriors'));
          const [r, p, s] = await Promise.all([
            api.get('/warriors/races'),
            api.get('/warriors/powers'),
            api.get('/warriors/spells'),
          ]);
          setRaces(r); setPowers(p); setSpells(s);
          break;
        case 'users':
          setUsers(await api.get('/admin/users'));
          break;
        case 'races':
          setRaces(await api.get('/warriors/races'));
          break;
        case 'powers':
          setPowers(await api.get('/warriors/powers'));
          break;
        case 'spells':
          setSpells(await api.get('/warriors/spells'));
          break;
        case 'matches':
          setMatches(await api.get('/admin/matches'));
          break;
      }
    } catch (err) {
      showMessage('Error cargando datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== WARRIOR HANDLERS ====================
  const handleWarriorSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...warriorForm,
        raceId: parseInt(warriorForm.raceId),
        powerId: parseInt(warriorForm.powerId),
        spellId: parseInt(warriorForm.spellId),
      };
      if (editingId) {
        await api.put(`/admin/warriors/${editingId}`, data);
        showMessage('Guerrero actualizado ✅');
      } else {
        await api.post('/admin/warriors', data);
        showMessage('Guerrero creado ✅');
      }
      setWarriorForm({ name: '', raceId: '', powerId: '', spellId: '', imageUrl: '', description: '' });
      setEditingId(null);
      loadData('warriors');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleEditWarrior = (w) => {
    setEditingId(w.id);
    setWarriorForm({
      name: w.name,
      raceId: w.raceId.toString(),
      powerId: w.powerId.toString(),
      spellId: w.spellId.toString(),
      imageUrl: w.imageUrl || '',
      description: w.description || '',
    });
  };

  const handleDeleteWarrior = async (id) => {
    if (!confirm('¿Eliminar este guerrero?')) return;
    try {
      await api.delete(`/admin/warriors/${id}`);
      showMessage('Guerrero eliminado ✅');
      loadData('warriors');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  // ==================== USER HANDLERS ====================
  const handleToggleRole = async (user) => {
    try {
      const newRole = user.role === 'ADMIN' ? 'PLAYER' : 'ADMIN';
      await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      showMessage(`Rol de ${user.username} cambiado a ${newRole} ✅`);
      loadData('users');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showMessage('Usuario eliminado ✅');
      loadData('users');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  // ==================== RACE HANDLERS ====================
  const handleRaceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/races/${editingId}`, raceForm);
        showMessage('Raza actualizada ✅');
      } else {
        await api.post('/admin/races', raceForm);
        showMessage('Raza creada ✅');
      }
      setRaceForm({ name: '', description: '' });
      setEditingId(null);
      loadData('races');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleDeleteRace = async (id) => {
    if (!confirm('¿Eliminar esta raza?')) return;
    try {
      await api.delete(`/admin/races/${id}`);
      showMessage('Raza eliminada ✅');
      loadData('races');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  // ==================== POWER HANDLERS ====================
  const handlePowerSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...powerForm, value: parseInt(powerForm.value) };
      if (editingId) {
        await api.put(`/admin/powers/${editingId}`, data);
        showMessage('Poder actualizado ✅');
      } else {
        await api.post('/admin/powers', data);
        showMessage('Poder creado ✅');
      }
      setPowerForm({ type: '', value: '' });
      setEditingId(null);
      loadData('powers');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleDeletePower = async (id) => {
    if (!confirm('¿Eliminar este poder?')) return;
    try {
      await api.delete(`/admin/powers/${id}`);
      showMessage('Poder eliminado ✅');
      loadData('powers');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  // ==================== SPELL HANDLERS ====================
  const handleSpellSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...spellForm, value: parseInt(spellForm.value) };
      if (editingId) {
        await api.put(`/admin/spells/${editingId}`, data);
        showMessage('Hechizo actualizado ✅');
      } else {
        await api.post('/admin/spells', data);
        showMessage('Hechizo creado ✅');
      }
      setSpellForm({ type: '', value: '' });
      setEditingId(null);
      loadData('spells');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleDeleteSpell = async (id) => {
    if (!confirm('¿Eliminar este hechizo?')) return;
    try {
      await api.delete(`/admin/spells/${id}`);
      showMessage('Hechizo eliminado ✅');
      loadData('spells');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!confirm('¿Eliminar esta partida?')) return;
    try {
      await api.delete(`/admin/matches/${id}`);
      showMessage('Partida eliminada ✅');
      loadData('matches');
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>🛡️ Panel de Administración</h1>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-tabs">
        {[
          { key: 'stats', label: '📊 Stats' },
          { key: 'warriors', label: '⚔️ Guerreros' },
          { key: 'users', label: '👤 Usuarios' },
          { key: 'races', label: '🧬 Razas' },
          { key: 'powers', label: '⚡ Poderes' },
          { key: 'spells', label: '✨ Hechizos' },
          { key: 'matches', label: '🎮 Partidas' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setEditingId(null); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Cargando...</div>}

        {/* ==================== STATS TAB ==================== */}
        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Usuarios</p></div>
            <div className="stat-card"><h3>{stats.totalWarriors}</h3><p>Guerreros</p></div>
            <div className="stat-card"><h3>{stats.totalMatches}</h3><p>Partidas</p></div>
            <div className="stat-card"><h3>{stats.finishedMatches}</h3><p>Finalizadas</p></div>
          </div>
        )}

        {/* ==================== WARRIORS TAB ==================== */}
        {activeTab === 'warriors' && (
          <div>
            <form onSubmit={handleWarriorSubmit} className="admin-form">
              <h3>{editingId ? 'Editar Guerrero' : 'Crear Guerrero'}</h3>
              <div className="form-row">
                <input placeholder="Nombre" value={warriorForm.name} onChange={e => setWarriorForm({...warriorForm, name: e.target.value})} required />
                <select value={warriorForm.raceId} onChange={e => setWarriorForm({...warriorForm, raceId: e.target.value})} required>
                  <option value="">Raza</option>
                  {races.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <select value={warriorForm.powerId} onChange={e => setWarriorForm({...warriorForm, powerId: e.target.value})} required>
                  <option value="">Poder</option>
                  {powers.map(p => <option key={p.id} value={p.id}>{p.type} ({p.value})</option>)}
                </select>
                <select value={warriorForm.spellId} onChange={e => setWarriorForm({...warriorForm, spellId: e.target.value})} required>
                  <option value="">Hechizo</option>
                  {spells.map(s => <option key={s.id} value={s.id}>{s.type} ({s.value})</option>)}
                </select>
              </div>
              <div className="form-row">
                <input placeholder="URL de imagen (ej: Warrior_1.png)" value={warriorForm.imageUrl} onChange={e => setWarriorForm({...warriorForm, imageUrl: e.target.value})} />
                <input placeholder="Descripción" value={warriorForm.description} onChange={e => setWarriorForm({...warriorForm, description: e.target.value})} />
                <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setWarriorForm({ name: '', raceId: '', powerId: '', spellId: '', imageUrl: '', description: '' }); }}>Cancelar</button>}
              </div>
            </form>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Raza</th><th>Poder</th><th>Hechizo</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {warriors.map(w => (
                  <tr key={w.id}>
                    <td>{w.id}</td>
                    <td>{w.name}</td>
                    <td>{w.race?.name}</td>
                    <td>{w.power?.type} ({w.power?.value})</td>
                    <td>{w.spell?.type} ({w.spell?.value})</td>
                    <td>
                      <button className="btn-sm btn-edit" onClick={() => handleEditWarrior(w)}>✏️</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDeleteWarrior(w.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Usuario</th><th>Rol</th><th>Registro</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-player'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-sm btn-edit" onClick={() => handleToggleRole(u)}>{u.role === 'ADMIN' ? '👤' : '🛡️'}</button>
                    <button className="btn-sm btn-delete" onClick={() => handleDeleteUser(u.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ==================== RACES TAB ==================== */}
        {activeTab === 'races' && (
          <div>
            <form onSubmit={handleRaceSubmit} className="admin-form">
              <h3>{editingId ? 'Editar Raza' : 'Crear Raza'}</h3>
              <div className="form-row">
                <input placeholder="Nombre" value={raceForm.name} onChange={e => setRaceForm({...raceForm, name: e.target.value})} required />
                <input placeholder="Descripción" value={raceForm.description} onChange={e => setRaceForm({...raceForm, description: e.target.value})} />
                <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setRaceForm({ name: '', description: '' }); }}>Cancelar</button>}
              </div>
            </form>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
              <tbody>
                {races.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.description}</td>
                    <td>
                      <button className="btn-sm btn-edit" onClick={() => { setEditingId(r.id); setRaceForm({ name: r.name, description: r.description || '' }); }}>✏️</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDeleteRace(r.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== POWERS TAB ==================== */}
        {activeTab === 'powers' && (
          <div>
            <form onSubmit={handlePowerSubmit} className="admin-form">
              <h3>{editingId ? 'Editar Poder' : 'Crear Poder'}</h3>
              <div className="form-row">
                <input placeholder="Tipo" value={powerForm.type} onChange={e => setPowerForm({...powerForm, type: e.target.value})} required />
                <input placeholder="Valor" type="number" value={powerForm.value} onChange={e => setPowerForm({...powerForm, value: e.target.value})} required />
                <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setPowerForm({ type: '', value: '' }); }}>Cancelar</button>}
              </div>
            </form>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Tipo</th><th>Valor</th><th>Acciones</th></tr></thead>
              <tbody>
                {powers.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.type}</td>
                    <td>{p.value}</td>
                    <td>
                      <button className="btn-sm btn-edit" onClick={() => { setEditingId(p.id); setPowerForm({ type: p.type, value: p.value.toString() }); }}>✏️</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDeletePower(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== SPELLS TAB ==================== */}
        {activeTab === 'spells' && (
          <div>
            <form onSubmit={handleSpellSubmit} className="admin-form">
              <h3>{editingId ? 'Editar Hechizo' : 'Crear Hechizo'}</h3>
              <div className="form-row">
                <input placeholder="Tipo" value={spellForm.type} onChange={e => setSpellForm({...spellForm, type: e.target.value})} required />
                <input placeholder="Valor" type="number" value={spellForm.value} onChange={e => setSpellForm({...spellForm, value: e.target.value})} required />
                <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
                {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setSpellForm({ type: '', value: '' }); }}>Cancelar</button>}
              </div>
            </form>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Tipo</th><th>Valor</th><th>Acciones</th></tr></thead>
              <tbody>
                {spells.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.type}</td>
                    <td>{s.value}</td>
                    <td>
                      <button className="btn-sm btn-edit" onClick={() => { setEditingId(s.id); setSpellForm({ type: s.type, value: s.value?.toString() || '' }); }}>✏️</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDeleteSpell(s.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== MATCHES TAB ==================== */}
        {activeTab === 'matches' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Modo</th><th>J1</th><th>J2</th><th>Ganador</th><th>Estado</th><th>Fecha</th><th>Acc.</th></tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.mode}</td>
                  <td>{m.player1?.username}</td>
                  <td>{m.player2?.username}</td>
                  <td>{m.winner?.username || '-'}</td>
                  <td><span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span></td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-sm btn-delete" onClick={() => handleDeleteMatch(m.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
