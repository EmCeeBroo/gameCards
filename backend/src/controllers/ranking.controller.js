import { rankingService } from '../services/ranking.service.js';

export const rankingController = {
  async getRanking(req, res) {
    try {
      const ranking = await rankingService.getRanking();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ranking.' });
    }
  },
};
