import prisma from '../config/prisma.js';

/**
 * Calcula el ganador de una batalla basado en la suma de power.value + spell.value
 * de los guerreros seleccionados por cada jugador.
 */
export const battleService = {
  async calculateWinner(matchId) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
        selections: {
          include: {
            warrior: {
              include: { power: true, spell: true },
            },
          },
        },
      },
    });

    if (!match) {
      throw { status: 404, message: 'Partida no encontrada.' };
    }

    // Separar selecciones por slot (1 para Jugador 1, 2 para Jugador 2)
    const player1Selections = match.selections.filter(s => s.playerSlot === 1);
    const player2Selections = match.selections.filter(s => s.playerSlot === 2);

    if (player1Selections.length === 0 || player2Selections.length === 0) {
      throw { status: 400, message: 'Ambos jugadores deben tener guerreros seleccionados.' };
    }

    // Calcular totales
    const player1Total = player1Selections.reduce((sum, s) => {
      return sum + (s.warrior.power?.value || 0) + (s.warrior.spell?.value || 0);
    }, 0);

    const player2Total = player2Selections.reduce((sum, s) => {
      return sum + (s.warrior.power?.value || 0) + (s.warrior.spell?.value || 0);
    }, 0);

    // Determinar ganador
    let winnerId = null;
    let winnerSlot = null;
    let result = 'draw';
    let reason = '';

    if (player1Total > player2Total) {
      winnerId = match.player1Id;
      winnerSlot = 1;
      result = 'player1';
      reason = `${match.player1.username} gana con ${player1Total} puntos vs ${player2Total} puntos.`;
    } else if (player2Total > player1Total) {
      winnerId = match.player2Id; // Puede ser null si es invitado
      winnerSlot = 2;
      result = 'player2';
      const player2Name = match.player2?.username || 'Invitado';
      reason = `${player2Name} gana con ${player2Total} puntos vs ${player1Total} puntos.`;
    } else {
      reason = `Empate: ambos jugadores con ${player1Total} puntos.`;
    }

    // Actualizar la partida con el resultado
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        winnerSlot,
        reasonForWin: reason,
        status: 'FINISHED',
      },
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
        winner: { select: { id: true, username: true } },
      },
    });

    return {
      match: updatedMatch,
      player1: {
        user: match.player1,
        total: player1Total,
        warriors: player1Selections.map(s => ({
          name: s.warrior.name,
          power: s.warrior.power?.value || 0,
          spell: s.warrior.spell?.value || 0,
          total: (s.warrior.power?.value || 0) + (s.warrior.spell?.value || 0),
        })),
      },
      player2: {
        user: match.player2,
        total: player2Total,
        warriors: player2Selections.map(s => ({
          name: s.warrior.name,
          power: s.warrior.power?.value || 0,
          spell: s.warrior.spell?.value || 0,
          total: (s.warrior.power?.value || 0) + (s.warrior.spell?.value || 0),
        })),
      },
      result,
      reason,
    };
  },
};
