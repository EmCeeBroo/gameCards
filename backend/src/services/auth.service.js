import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authService = {
  async register(username, password) {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw { status: 400, message: 'El nombre de usuario ya está registrado.' };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      username: user.username,
    };
  },

  async login(username, password) {
    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw { status: 400, message: 'Usuario o contraseña incorrectos.' };
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw { status: 400, message: 'Usuario o contraseña incorrectos.' };
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    };
  },
};
