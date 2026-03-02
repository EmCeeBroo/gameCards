import prisma from '../config/prisma.js';
import { warriorService } from '../services/warrior.service.js';
import bcrypt from 'bcryptjs';

export const adminController = {
  // ==================== STATS ====================
  async getStats(req, res) {
    try {
      const [totalUsers, totalWarriors, totalMatches, finishedMatches] = await Promise.all([
        prisma.user.count(),
        prisma.warrior.count(),
        prisma.match.count(),
        prisma.match.count({ where: { status: 'FINISHED' } }),
      ]);
      res.json({ totalUsers, totalWarriors, totalMatches, finishedMatches });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas.' });
    }
  },

  // ==================== WARRIORS CRUD ====================
  async createWarrior(req, res) {
    try {
      const { name, raceId, powerId, spellId, imageUrl, description } = req.body;
      if (!name || !raceId || !powerId || !spellId) {
        return res.status(400).json({ error: 'Nombre, raza, poder y hechizo son obligatorios.' });
      }
      const warrior = await warriorService.create({ name, raceId, powerId, spellId, imageUrl, description });
      res.status(201).json({ message: 'Guerrero creado.', data: warrior });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error creando guerrero.' });
    }
  },

  async updateWarrior(req, res) {
    try {
      const id = parseInt(req.params.id);
      const warrior = await warriorService.update(id, req.body);
      res.json({ message: 'Guerrero actualizado.', data: warrior });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error actualizando guerrero.' });
    }
  },

  async deleteWarrior(req, res) {
    try {
      const id = parseInt(req.params.id);
      await warriorService.delete(id);
      res.json({ message: 'Guerrero eliminado.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Error eliminando guerrero.' });
    }
  },

  // ==================== USERS MANAGEMENT ====================
  async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, createdAt: true },
        orderBy: { id: 'asc' },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
  },

  async updateUserRole(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body;
      if (!['PLAYER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido. Usa PLAYER o ADMIN.' });
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, username: true, role: true },
      });
      res.json({ message: 'Rol actualizado.', data: user });
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando rol.' });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (id === req.user.id) {
        return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' });
      }
      await prisma.user.delete({ where: { id } });
      res.json({ message: 'Usuario eliminado.' });
    } catch (error) {
      res.status(500).json({ error: 'Error eliminando usuario.' });
    }
  },

  // ==================== RACES CRUD ====================
  async createRace(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ error: 'Nombre es obligatorio.' });
      const race = await prisma.race.create({ data: { name, description } });
      res.status(201).json({ message: 'Raza creada.', data: race });
    } catch (error) {
      res.status(500).json({ error: 'Error creando raza.' });
    }
  },

  async updateRace(req, res) {
    try {
      const id = parseInt(req.params.id);
      const race = await prisma.race.update({ where: { id }, data: req.body });
      res.json({ message: 'Raza actualizada.', data: race });
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando raza.' });
    }
  },

  async deleteRace(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.race.delete({ where: { id } });
      res.json({ message: 'Raza eliminada.' });
    } catch (error) {
      res.status(500).json({ error: 'Error eliminando raza.' });
    }
  },

  // ==================== POWERS CRUD ====================
  async createPower(req, res) {
    try {
      const { type, value } = req.body;
      if (!type || value === undefined) return res.status(400).json({ error: 'Tipo y valor son obligatorios.' });
      const power = await prisma.power.create({ data: { type, value } });
      res.status(201).json({ message: 'Poder creado.', data: power });
    } catch (error) {
      res.status(500).json({ error: 'Error creando poder.' });
    }
  },

  async updatePower(req, res) {
    try {
      const id = parseInt(req.params.id);
      const power = await prisma.power.update({ where: { id }, data: req.body });
      res.json({ message: 'Poder actualizado.', data: power });
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando poder.' });
    }
  },

  async deletePower(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.power.delete({ where: { id } });
      res.json({ message: 'Poder eliminado.' });
    } catch (error) {
      res.status(500).json({ error: 'Error eliminando poder.' });
    }
  },

  // ==================== SPELLS CRUD ====================
  async createSpell(req, res) {
    try {
      const { type, value } = req.body;
      if (!type) return res.status(400).json({ error: 'Tipo es obligatorio.' });
      const spell = await prisma.spell.create({ data: { type, value } });
      res.status(201).json({ message: 'Hechizo creado.', data: spell });
    } catch (error) {
      res.status(500).json({ error: 'Error creando hechizo.' });
    }
  },

  async updateSpell(req, res) {
    try {
      const id = parseInt(req.params.id);
      const spell = await prisma.spell.update({ where: { id }, data: req.body });
      res.json({ message: 'Hechizo actualizado.', data: spell });
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando hechizo.' });
    }
  },

  async deleteSpell(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.spell.delete({ where: { id } });
      res.json({ message: 'Hechizo eliminado.' });
    } catch (error) {
      res.status(500).json({ error: 'Error eliminando hechizo.' });
    }
  },

  // ==================== MATCHES MANAGEMENT ====================
  async getMatches(req, res) {
    try {
      const matches = await prisma.match.findMany({
        include: {
          player1: { select: { id: true, username: true } },
          player2: { select: { id: true, username: true } },
          winner: { select: { id: true, username: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener partidas.' });
    }
  },

  async deleteMatch(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.match.delete({ where: { id } });
      res.json({ message: 'Partida eliminada.' });
    } catch (error) {
      res.status(500).json({ error: 'Error eliminando partida.' });
    }
  },
};
