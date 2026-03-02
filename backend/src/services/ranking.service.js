import prisma from '../config/prisma.js';

export const rankingService = {
  async getRanking() {
    // Obtener TODAS las partidas finalizadas con los datos necesarios
    const matches = await prisma.match.findMany({
      where: { status: 'FINISHED' },
      select: {
        id: true,
        winnerSlot: true,
        player1Id: true,
        player2Id: true,
        player2Name: true,
        player1: { select: { username: true } },
        player2: { select: { username: true } },
      },
    });

    // Mapa para acumular stats por nombre de identidad
    const statsMap = {};

    const getOrCreate = (name) => {
      if (!statsMap[name]) {
        statsMap[name] = { username: name, wins: 0, losses: 0, draws: 0 };
      }
      return statsMap[name];
    };

    matches.forEach(m => {
      const p1Name = m.player1?.username || 'Desconocido';
      const p2Name = m.player2Name || m.player2?.username || 'Invitado';

      const p1Stats = getOrCreate(p1Name);
      const p2Stats = getOrCreate(p2Name);

      if (m.winnerSlot === 1) {
        p1Stats.wins++;
        p2Stats.losses++;
      } else if (m.winnerSlot === 2) {
        p2Stats.wins++;
        p1Stats.losses++;
      } else {
        p1Stats.draws++;
        p2Stats.draws++;
      }
    });

    // Convertir mapa a array y calcular totales
    const ranking = Object.values(statsMap).map(s => {
      const totalMatches = s.wins + s.losses + s.draws;
      return {
        username: s.username,
        wins: s.wins,
        losses: s.losses,
        draws: s.draws,
        totalMatches,
        winRate: totalMatches > 0 ? Math.round((s.wins / totalMatches) * 100) : 0,
      };
    });

    // Ordenar por victorias desc, luego win rate desc
    ranking.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);

    return ranking;
  },
};
