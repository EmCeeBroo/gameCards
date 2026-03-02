import { matchService } from '../services/match.service.js';
import { battleService } from '../services/battle.service.js';

export const matchController = {
  async create(req, res) {
    try {
      const { player1Id, player2Id, mode, player2Name } = req.body;

      if (!player1Id) {
        return res.status(400).json({ error: 'Se requiere al menos el ID del jugador 1.' });
      }

      const p1Id = parseInt(player1Id);
      const p2Id = player2Id ? parseInt(player2Id) : null;

      const match = await matchService.create(p1Id, p2Id, mode, player2Name || 'Invitado');
      res.status(201).json({ message: 'Partida creada con éxito.', data: match });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error creando partida.' });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const match = await matchService.getById(id);
      res.json(match);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error al obtener partida.' });
    }
  },

  async getAll(req, res) {
    try {
      const matches = await matchService.getAll();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener partidas.' });
    }
  },

  async saveSelections(req, res) {
    try {
      const matchId = parseInt(req.params.id);
      const { warriorIds, playerSlot } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(warriorIds) || warriorIds.length === 0) {
        return res.status(400).json({ error: 'Debes enviar un array de IDs de guerreros.' });
      }

      const selections = await matchService.saveSelections(matchId, userId, warriorIds, playerSlot);
      res.json({ message: 'Selección guardada con éxito.', data: selections });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error guardando selección.' });
    }
  },

  async battle(req, res) {
    try {
      const matchId = parseInt(req.params.id);
      const result = await battleService.calculateWinner(matchId);
      res.json({ message: 'Batalla finalizada.', data: result });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error en la batalla.' });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await matchService.delete(id);
      res.json({ message: 'Partida eliminada con éxito.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error eliminando partida.' });
    }
  },
};
