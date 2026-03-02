import { warriorService } from '../services/warrior.service.js';

export const warriorController = {
  async getAll(req, res) {
    try {
      const warriors = await warriorService.getAll();
      res.json(warriors);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener guerreros.' });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const warrior = await warriorService.getById(id);
      res.json(warrior);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error al obtener guerrero.' });
    }
  },

  async getRaces(req, res) {
    try {
      const races = await warriorService.getRaces();
      res.json(races);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener razas.' });
    }
  },

  async getPowers(req, res) {
    try {
      const powers = await warriorService.getPowers();
      res.json(powers);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener poderes.' });
    }
  },

  async getSpells(req, res) {
    try {
      const spells = await warriorService.getSpells();
      res.json(spells);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener hechizos.' });
    }
  },
};
