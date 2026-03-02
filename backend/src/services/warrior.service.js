import prisma from '../config/prisma.js';

export const warriorService = {
  async getAll() {
    return prisma.warrior.findMany({
      include: {
        race: true,
        power: true,
        spell: true,
      },
      orderBy: { id: 'asc' },
    });
  },

  async getById(id) {
    const warrior = await prisma.warrior.findUnique({
      where: { id },
      include: {
        race: true,
        power: true,
        spell: true,
      },
    });
    if (!warrior) {
      throw { status: 404, message: 'Guerrero no encontrado.' };
    }
    return warrior;
  },

  async create(data) {
    return prisma.warrior.create({
      data,
      include: { race: true, power: true, spell: true },
    });
  },

  async update(id, data) {
    const warrior = await prisma.warrior.findUnique({ where: { id } });
    if (!warrior) {
      throw { status: 404, message: 'Guerrero no encontrado.' };
    }
    return prisma.warrior.update({
      where: { id },
      data,
      include: { race: true, power: true, spell: true },
    });
  },

  async delete(id) {
    const warrior = await prisma.warrior.findUnique({ where: { id } });
    if (!warrior) {
      throw { status: 404, message: 'Guerrero no encontrado.' };
    }
    return prisma.warrior.delete({ where: { id } });
  },

  async getRaces() {
    return prisma.race.findMany({ orderBy: { id: 'asc' } });
  },

  async getPowers() {
    return prisma.power.findMany({ orderBy: { id: 'asc' } });
  },

  async getSpells() {
    return prisma.spell.findMany({ orderBy: { id: 'asc' } });
  },
};
