import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== RAZAS ====================
  const races = await Promise.all([
    prisma.race.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Apóstol",
        description: "Seres demoníacos con poderes sobrenaturales.",
      },
    }),
    prisma.race.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "Monstruo",
        description: "Criaturas de diversa índole, a menudo peligrosas.",
      },
    }),
    prisma.race.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: "Humano",
        description: "La raza dominante, con gran variedad de habilidades.",
      },
    }),
    prisma.race.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: "No-Muerto",
        description:
          "Seres que han regresado de la muerte, con diferentes formas y propósitos.",
      },
    }),
    prisma.race.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: "Dios",
        description: "Entidades supremas con poder divino.",
      },
    }),
  ]);
  console.log(`✅ ${races.length} razas creadas`);

  // ==================== PODERES ====================
  const powers = await Promise.all([
    prisma.power.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, type: "Manipulación de Sombras", value: 40 },
    }),
    prisma.power.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, type: "Enjambre de Espinas", value: 65 },
    }),
    prisma.power.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, type: "Furia Bruta", value: 80 },
    }),
    prisma.power.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, type: "Bola de Fuego", value: 35 },
    }),
    prisma.power.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, type: "Escudo Divino", value: 85 },
    }),
    prisma.power.upsert({
      where: { id: 6 },
      update: {},
      create: { id: 6, type: "Estampida Final", value: 98 },
    }),
    prisma.power.upsert({
      where: { id: 7 },
      update: {},
      create: { id: 7, type: "Cañón de Dios", value: 90 },
    }),
    prisma.power.upsert({
      where: { id: 8 },
      update: {},
      create: { id: 8, type: "Levantar Muertos", value: 82 },
    }),
    prisma.power.upsert({
      where: { id: 9 },
      update: {},
      create: { id: 9, type: "Control Realidad", value: 98 },
    }),
    prisma.power.upsert({
      where: { id: 10 },
      update: {},
      create: { id: 10, type: "Luz Sagrada", value: 99 },
    }),
    prisma.power.upsert({
      where: { id: 11 },
      update: {},
      create: { id: 11, type: "Trampas", value: 60 },
    }),
    prisma.power.upsert({
      where: { id: 12 },
      update: {},
      create: { id: 12, type: "Golpe Devastador", value: 92 },
    }),
    prisma.power.upsert({
      where: { id: 13 },
      update: {},
      create: { id: 13, type: "Corte Perfecto", value: 73 },
    }),
  ]);
  console.log(`✅ ${powers.length} poderes creados`);

  // ==================== HECHIZOS ====================
  const spells = await Promise.all([
    prisma.spell.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, type: "INRA", value: 80 },
    }),
    prisma.spell.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, type: "Camuflaje Arbóreo", value: 10 },
    }),
    prisma.spell.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, type: "Resistencia", value: 0 },
    }),
    prisma.spell.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, type: "Curación", value: 60 },
    }),
    prisma.spell.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, type: "Sanación", value: 40 },
    }),
    prisma.spell.upsert({
      where: { id: 6 },
      update: {},
      create: { id: 6, type: "Sigilo", value: 30 },
    }),
    prisma.spell.upsert({
      where: { id: 7 },
      update: {},
      create: { id: 7, type: "Último Suspiro", value: 95 },
    }),
    prisma.spell.upsert({
      where: { id: 8 },
      update: {},
      create: { id: 8, type: "Maldición", value: 97 },
    }),
    prisma.spell.upsert({
      where: { id: 9 },
      update: {},
      create: { id: 9, type: "Desintegrar", value: 99 },
    }),
    prisma.spell.upsert({
      where: { id: 10 },
      update: {},
      create: { id: 10, type: "Realidad Alterna", value: 99 },
    }),
    prisma.spell.upsert({
      where: { id: 11 },
      update: {},
      create: { id: 11, type: "Golpe Certero", value: 20 },
    }),
    prisma.spell.upsert({
      where: { id: 12 },
      update: {},
      create: { id: 12, type: "Grito de Guerra", value: 30 },
    }),
  ]);
  console.log(`✅ ${spells.length} hechizos creados`);

  // ==================== GUERREROS ====================
  const warriors = await Promise.all([
    prisma.warrior.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Rakshas",
        raceId: 1,
        powerId: 1,
        spellId: 1,
        imageUrl: "Warrior_1.png",
        description:
          "Un Apóstol con habilidades de manipulación de sombras e INRA.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "Guardián del Bosque",
        raceId: 2,
        powerId: 2,
        spellId: 2,
        imageUrl: "Warrior_2.png",
        description:
          "Un monstruo con habilidades de enjambre de espinas y camuflaje arbóreo.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: "Guts",
        raceId: 3,
        powerId: 3,
        spellId: 3,
        imageUrl: "Warrior_3.png",
        description: "Un humano con habilidades de furia bruta y resistencia.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: "Serupiko",
        raceId: 3,
        powerId: 4,
        spellId: 4,
        imageUrl: "Warrior_4.png",
        description: "Un humano con habilidades de bola de fuego y curación.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: "Grunbeld",
        raceId: 1,
        powerId: 5,
        spellId: 5,
        imageUrl: "Warrior_5.png",
        description: "Un Apóstol con habilidades de escudo divino y sanación.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        name: "Nosferatu Zodd",
        raceId: 1,
        powerId: 6,
        spellId: 6,
        imageUrl: "Warrior_6.png",
        description: "Un Apóstol con habilidades de estampida final y sigilo.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 7 },
      update: {},
      create: {
        id: 7,
        name: "Grunbeld Perfecto",
        raceId: 1,
        powerId: 7,
        spellId: 7,
        imageUrl: "Warrior_7.png",
        description:
          "Un Apóstol con habilidades de cañón de dios y último suspiro.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 8 },
      update: {},
      create: {
        id: 8,
        name: "Skull Knight",
        raceId: 4,
        powerId: 8,
        spellId: 8,
        imageUrl: "Warrior_8.png",
        description:
          "Un No-Muerto con habilidades de levantar muertos y maldición.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 9 },
      update: {},
      create: {
        id: 9,
        name: "Slan",
        raceId: 5,
        powerId: 9,
        spellId: 9,
        imageUrl: "Warrior_9.png",
        description:
          "Una Diosa con habilidades de control de realidad y desintegrar.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 10 },
      update: {},
      create: {
        id: 10,
        name: "Griffith",
        raceId: 5,
        powerId: 10,
        spellId: 10,
        imageUrl: "Warrior_10.png",
        description:
          "Un Dios con habilidades de luz sagrada y realidad alterna.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 11 },
      update: {},
      create: {
        id: 11,
        name: "Troll",
        raceId: 2,
        powerId: 11,
        spellId: 11,
        imageUrl: "Warrior_11.png",
        description: "Un Monstruo con habilidades de trampas y golpe certero.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 12 },
      update: {},
      create: {
        id: 12,
        name: "Guts Adulto",
        raceId: 3,
        powerId: 12,
        spellId: 12,
        imageUrl: "Warrior_12.png",
        description:
          "Un Humano con habilidades de golpe devastador y grito de guerra.",
      },
    }),
    prisma.warrior.upsert({
      where: { id: 13 },
      update: {},
      create: {
        id: 13,
        name: "Casca",
        raceId: 3,
        powerId: 13,
        spellId: 12,
        imageUrl: "Warrior_13.png",
        description:
          "Una Humana con habilidades de corte perfecto y grito de guerra.",
      },
    }),
  ]);
  console.log(`✅ ${warriors.length} guerreros creados`);

  // ==================== ADMIN USER ====================
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Usuario admin creado (username: admin, password: admin123)`);

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
