# 🃏 Game Cards

Full Stack card battle game built with the **MERV** stack — MySQL, Express, React and Vite with Prisma as ORM.

This project was originally developed as a native web application and later migrated to a modern React + Vite architecture. It simulates a real-world professional development environment, applying best practices in database design, REST API architecture, JWT authentication, and role-based access control.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Warriors](#warriors)
  - [Matches](#matches)
  - [Ranking](#ranking)
  - [Admin](#admin)

---

## Overview

Game Cards is a turn-based card battle game where players select warriors and face off in different game modes. Key features include:

- User registration and authentication with **JWT**
- Role-based access control: **Administrator** and **Player**
- Game modes: **1v1**, **3v3**, and **5v5**
- Selection of warriors from a pool of 16 available characters
- Automated battle simulation and result calculation
- Persistent ranking system tracking wins, losses, and draws
- Admin panel with full CRUD management over all system resources

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Database   | MySQL                             |
| ORM        | Prisma                            |
| Backend    | Node.js + Express (REST API)      |
| Frontend   | React + Vite                      |
| Auth       | JWT (JSON Web Tokens)             |

---

## Prerequisites

Before cloning and running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MySQL](https://www.mysql.com/) v8 or higher (running locally or via a service like XAMPP / Railway / PlanetScale)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/EmCeeBroo/gameCards.git
cd gameCards
```

### 2. Install dependencies

If the project has separate `backend` and `frontend` folders, install both:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the **backend** folder (see [Environment Variables](#environment-variables) below).

### 4. Set up the database

Run Prisma migrations to create the schema in your MySQL database:

```bash
cd backend
npx prisma migrate dev
```

Optionally, seed the database with the initial warrior data:

```bash
npx prisma db seed
```

### 5. Run the application

```bash
# Start the backend (runs on port 3000)
cd backend
npm run dev

# Start the frontend (in a separate terminal)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database connection string for Prisma
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/game_cards"

# JWT secret key — use a long random string
JWT_SECRET="your_super_secret_key_here"

# Server port (default: 3000)
PORT=3000
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

---

## API Documentation

All API endpoints are prefixed with `/api`. The backend runs on `http://localhost:3000` by default.

### Authentication required

Endpoints marked with 🔒 require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

Endpoints marked with 🛡️ additionally require the **ADMIN** role.

---

### Authentication

#### `POST /api/auth/register`

Registers a new user. Does **not** return a token — only creates the account.

**Request body:**
```json
{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

---

#### `POST /api/auth/login`

Authenticates a user and returns a JWT token to use in subsequent requests.

**Request body:**
```json
{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

---

### Warriors

Public endpoints — no authentication required.

#### `GET /api/warriors`

Returns the full list of available warriors.

---

#### `GET /api/warriors/:id`

Returns the details of a specific warrior by ID.

**Example:** `GET /api/warriors/2`

---

#### `GET /api/warriors/races`

Returns all available warrior races.

---

#### `GET /api/warriors/powers`

Returns all available power types.

---

#### `GET /api/warriors/spells`

Returns all available spells.

---

### Matches

#### `POST /api/matches` 🔒

Creates a new match. Supports two modes:

**Local mode** (Player 2 has no account):
```json
{
  "playerId": 1,
  "player2Id": null,
  "player2Name": "Guest Name",
  "mode": "ONE_VS_ONE"
}
```

**Online mode** (both players have accounts):
```json
{
  "player1Id": 1,
  "player2Id": 2,
  "mode": "THREE_VS_THREE"
}
```

Available modes: `ONE_VS_ONE`, `THREE_VS_THREE`, `FIVE_VS_FIVE`

---

#### `POST /api/matches/:id/selections` 🔒

Saves a player's warrior selection for a match.

**Example:** `POST /api/matches/1/selections`

```json
{
  "warriorsIds": [1],
  "playerSlot": 1
}
```

`playerSlot` should be `1` for Player 1 or `2` for Player 2.

---

#### `POST /api/matches/:id/battle` 🔒

Executes the battle and calculates the result based on each warrior's total score `(Power + Spell)` per player slot.

**Example:** `POST /api/matches/1/battle`

```json
{
  "warriorsIds": [1],
  "playerSlot": 1
}
```

---

#### `GET /api/matches` 🔒

Returns the full match history. Requires authentication.

---

#### `GET /api/matches/:id` 🔒

Returns the details of a specific match, including selections and the winner.

**Example:** `GET /api/matches/1`

---

#### `DELETE /api/matches/:id` 🔒🛡️

Deletes a specific match. Only accessible by an **Administrator**.

---

### Ranking

#### `GET /api/ranking`

Returns the battle ranking grouped by player name (not by account). Both registered and guest players appear independently. At least one match must have been played for results to appear.

---

### Admin

All endpoints in this section require authentication 🔒 and the **ADMIN** role 🛡️.

---

#### `GET /api/admin/stats`

Returns global system statistics: total users, total matches, and the most used warrior.

---

#### Warriors Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/warriors` | Creates a new warrior |
| `PUT` | `/api/admin/warriors/:id` | Updates an existing warrior |
| `DELETE` | `/api/admin/warriors/:id` | Deletes a warrior |

**Create / Update body:**
```json
{
  "name": "Warrior Name",
  "raceId": 1,
  "powerId": 1,
  "spellId": 1,
  "imageUrl": "https://example.com/image.png",
  "description": "Optional description"
}
```

> `imageUrl` and `description` are optional fields.

---

#### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Lists all registered users |
| `PUT` | `/api/admin/users/:id/role` | Updates a user's role |
| `DELETE` | `/api/admin/users/:id` | Deletes a user |

**Update role body:**
```json
{
  "role": "ADMIN"
}
```

Available roles: `ADMIN`, `PLAYER`

---

#### Attribute Management — Races

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/races` | Creates a new race |
| `PUT` | `/api/admin/races/:id` | Updates a race |
| `DELETE` | `/api/admin/races/:id` | Deletes a race |

**Body:**
```json
{
  "name": "Elf",
  "description": "Agile race"
}
```

---

#### Attribute Management — Powers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/powers` | Creates a new power |
| `PUT` | `/api/admin/powers/:id` | Updates a power |
| `DELETE` | `/api/admin/powers/:id` | Deletes a power |

**Body:**
```json
{
  "type": "Fire",
  "value": 80
}
```

---

#### Attribute Management — Spells

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/spells` | Creates a new spell |
| `PUT` | `/api/admin/spells/:id` | Updates a spell |
| `DELETE` | `/api/admin/spells/:id` | Deletes a spell |

**Body:**
```json
{
  "type": "Ice Ray",
  "value": 50
}
```

---

#### Match Management (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/matches` | Lists all matches in the system |
| `DELETE` | `/api/admin/matches/:id` | Deletes a specific match |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

Copyright (c) 2026 EmCeeCode. Feel free to explore, fork, and learn from it.
