import prisma from "../config/prisma.js";

const MODE_CARD_LIMIT = {
  ONE_VS_ONE: 1,
  THREE_VS_THREE: 3,
  FIVE_VS_FIVE: 5,
};

export const matchService = {
  async create(player1Id, player2Id, mode = "FIVE_VS_FIVE", player2Name = 'Invitado') {
    // Permitir juego local donde el mismo usuario controla ambos jugadores
    // if (player1Id === player2Id) {
    //   throw { status: 400, message: 'Los jugadores deben ser diferentes.' };
    // }

    // El frontend ya envía el modo en el formato correcto (ONE_VS_ONE, THREE_VS_THREE, FIVE_VS_FIVE)

    const match = await prisma.match.create({
      data: {
        player1Id,
        player2Id: player2Id || null, // Permitir null para invitados
        player2Name,
        mode: mode,
        status: "SELECTING",
      },
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
      },
    });

    return match;
  },

  async getById(id) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
        winner: { select: { id: true, username: true } },
        selections: {
          include: {
            warrior: {
              include: { race: true, power: true, spell: true },
            },
            user: { select: { id: true, username: true } },
          },
        },
      },
    });

    if (!match) {
      throw { status: 404, message: "Partida no encontrada." };
    }
    return match;
  },

  async getAll() {
    return prisma.match.findMany({
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
        winner: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async saveSelections(matchId, userId, warriorIds, playerSlot) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      throw { status: 404, message: "Partida no encontrada." };
    }

    // Verificar que el usuario es parte de la partida (solo si el slot2 no es invitado)
    if (
      match.player1Id !== userId &&
      match.player2Id !== null &&
      match.player2Id !== userId
    ) {
      throw { status: 403, message: "No eres parte de esta partida." };
    }

    // Verificar límite de cartas según modo
    const maxCards = MODE_CARD_LIMIT[match.mode];
    if (warriorIds.length !== maxCards) {
      throw {
        status: 400,
        message: `Debes seleccionar exactamente ${maxCards} guerrero(s) para el modo ${match.mode}.`,
      };
    }

    // Eliminar selecciones previas para este slot en esta partida
    await prisma.playerSelection.deleteMany({
      where: { matchId, playerSlot },
    });

    // Crear nuevas selecciones
    const selections = await Promise.all(
      warriorIds.map((warriorId) =>
        prisma.playerSelection.create({
          data: { matchId, userId, warriorId, playerSlot },
          include: {
            warrior: { include: { race: true, power: true, spell: true } },
          },
        }),
      ),
    );

    return selections;
  },

  async finishMatch(matchId, winnerId, reasonForWin) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      throw { status: 404, message: "Partida no encontrada." };
    }

    return prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        reasonForWin,
        status: "FINISHED",
      },
      include: {
        player1: { select: { id: true, username: true } },
        player2: { select: { id: true, username: true } },
        winner: { select: { id: true, username: true } },
      },
    });
  },

  async delete(id) {
    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) {
      throw { status: 404, message: "Partida no encontrada." };
    }
    return prisma.match.delete({ where: { id } });
  },
};
