import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
      }

      const result = await authService.register(username, password);
      res.status(201).json({ message: 'Usuario registrado con éxito.', data: result });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error registrando usuario.' });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
      }

      const result = await authService.login(username, password);
      res.json({ message: 'Login exitoso.', data: result });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error en login.' });
    }
  },
};
