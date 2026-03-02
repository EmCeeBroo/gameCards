# Documentación Completa de la API - Warriors Game

Esta documentación contiene **todos** los endpoints del sistema para que puedas reconstruir tu colección en Postman.

## 📌 Configuración Base

- **URL Base**: `http://localhost:3000/api`
- **Headers sugeridos**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <tu_token_aqui>` (para rutas protegidas)

---

## 🔐 1. Autenticación (`/auth`)

| Método   | Endpoint         | Descripción                    | Body (JSON)                                |
| :------- | :--------------- | :----------------------------- | :----------------------------------------- |
| **POST** | `/auth/register` | Registrar un nuevo usuario     | `{ "username": "...", "password": "..." }` |
| **POST** | `/auth/login`    | Iniciar sesión y obtener token | `{ "username": "...", "password": "..." }` |

### Detalles de Respuesta

**POST `/auth/register`** — Solo registra, **NO** devuelve token ni inicia sesión.

```json
// Request
{ "username": "nuevo_jugador", "password": "miPassword123" }

// Response 201
{
  "message": "Usuario registrado con éxito.",
  "data": { "id": 2, "username": "nuevo_jugador" }
}
```

**POST `/auth/login`** — Devuelve token JWT para autenticación.

```json
// Request
{ "username": "admin", "password": "admin123" }

// Response 200
{
  "message": "Login exitoso.",
  "data": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## ⚔️ 2. Guerreros y Atributos (`/warriors`)

| Método  | Endpoint           | Descripción                                |
| :------ | :----------------- | :----------------------------------------- |
| **GET** | `/warriors`        | Listar todos los guerreros disponibles     |
| **GET** | `/warriors/:id`    | Obtener detalles de un guerrero específico |
| **GET** | `/warriors/races`  | Obtener lista de razas                     |
| **GET** | `/warriors/powers` | Obtener lista de poderes                   |
| **GET** | `/warriors/spells` | Obtener lista de hechizos                  |

---

## 🛡️ 3. Partidas y Batallas (`/matches`)

| Método     | Endpoint                  | Descripción                         | Body / Notas                                                          |
| :--------- | :------------------------ | :---------------------------------- | :-------------------------------------------------------------------- |
| **POST**   | `/matches`                | Crear una nueva partida             | Ver ejemplo abajo                                                     |
| **POST**   | `/matches/:id/selections` | Guardar selección de cartas         | `{ "warriorIds": [1], "playerSlot": 1 }` **(Llamar para slot 1 y 2)** |
| **POST**   | `/matches/:id/battle`     | Ejecutar batalla y calcular ganador | Calcula el total (Poder + Hechizo) por slot.                          |
| **GET**    | `/matches`                | Ver historial de partidas           | Requiere Token.                                                       |
| **GET**    | `/matches/:id`            | Ver detalles de una partida         | Incluye selecciones y ganador.                                        |
| **DELETE** | `/matches/:id`            | Eliminar una partida                | Solo Admin o dueño.                                                   |

### Crear Partida — POST `/matches`

El campo `player2Id` es **opcional** (null para modo invitado/local).  
El campo `player2Name` identifica al Jugador 2 en el ranking.

```json
// Modo Invitado (local) — el J2 no tiene cuenta
{
  "player1Id": 1,
  "player2Id": null,
  "player2Name": "Carlos",
  "mode": "FIVE_VS_FIVE"
}

// Modo Online (ambos con cuenta) — player2Name no es necesario
{
  "player1Id": 1,
  "player2Id": 2,
  "mode": "THREE_VS_THREE"
}
```

**Modos disponibles**: `ONE_VS_ONE`, `THREE_VS_THREE`, `FIVE_VS_FIVE`

### Respuesta de Batalla — POST `/matches/:id/battle`

```json
{
  "match": {
    "id": 1,
    "winnerId": 1,
    "winnerSlot": 1,
    "status": "FINISHED",
    "reasonForWin": "admin gana con 150 puntos vs 120 puntos."
  },
  "player1": {
    "user": { "id": 1, "username": "admin" },
    "total": 150,
    "warriors": [{ "name": "Guerrero1", "power": 50, "spell": 30, "total": 80 }]
  },
  "player2": {
    "user": null,
    "total": 120,
    "warriors": [{ "name": "Guerrero2", "power": 40, "spell": 25, "total": 65 }]
  },
  "result": "player1",
  "reason": "admin gana con 150 puntos vs 120 puntos."
}
```

> **`winnerSlot`**: `1` = ganó Jugador 1, `2` = ganó Jugador 2, `null` = empate.

---

## 📊 4. Ranking (`/ranking`)

| Método  | Endpoint   | Descripción                                                        |
| :------ | :--------- | :----------------------------------------------------------------- |
| **GET** | `/ranking` | Ranking agrupado por identidad de jugador (nombre), no por cuenta. |

### Respuesta del Ranking

El ranking agrupa los resultados por **nombre de jugador**. Tanto usuarios registrados como invitados aparecen como entradas independientes. Solo aparecen jugadores que han participado en al menos una partida.

```json
[
  {
    "username": "admin",
    "wins": 3,
    "losses": 1,
    "draws": 0,
    "totalMatches": 4,
    "winRate": 75
  },
  {
    "username": "Carlos",
    "wins": 1,
    "losses": 3,
    "draws": 0,
    "totalMatches": 4,
    "winRate": 25
  }
]
```

---

## 👑 5. Administración (`/admin`)

_Todas requieren Token de un usuario con `role: ADMIN`._

### 📈 General

| Método  | Endpoint       | Descripción                                                     |
| :------ | :------------- | :-------------------------------------------------------------- |
| **GET** | `/admin/stats` | Estadísticas globales (usuarios, partidas, guerrero más usado). |

**Respuesta** `GET /admin/stats`:

```json
{
  "totalUsers": 5,
  "totalWarriors": 12,
  "totalMatches": 8,
  "finishedMatches": 6
}
```

---

### 🧙 Gestión de Guerreros

| Método     | Endpoint              | Descripción                   | Body (JSON)                                                                                                         |
| :--------- | :-------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **POST**   | `/admin/warriors`     | Crear un nuevo guerrero       | `{ "name": "Arthas", "raceId": 1, "powerId": 2, "spellId": 3, "imageUrl": "https://...", "description": "Un ..." }` |
| **PUT**    | `/admin/warriors/:id` | Actualizar datos del guerrero | Mismo formato que POST (todos los campos opcionales).                                                               |
| **DELETE** | `/admin/warriors/:id` | Eliminar permanentemente      | N/A                                                                                                                 |

**Campos de Warrior:**

| Campo         | Tipo   | Obligatorio | Descripción                         |
| :------------ | :----- | :---------- | :---------------------------------- |
| `name`        | String | ✅ Sí       | Nombre del guerrero (máx. 100 char) |
| `raceId`      | Int    | ✅ Sí       | ID de la Raza (FK → `races`)        |
| `powerId`     | Int    | ✅ Sí       | ID del Poder (FK → `powers`)        |
| `spellId`     | Int    | ✅ Sí       | ID del Hechizo (FK → `spells`)      |
| `imageUrl`    | String | ❌ No       | URL de imagen (máx. 255 char)       |
| `description` | String | ❌ No       | Descripción del guerrero (texto)    |

**Ejemplo Completo** — `POST /admin/warriors`:

```json
// Request
{
  "name": "Arthas",
  "raceId": 1,
  "powerId": 2,
  "spellId": 3,
  "imageUrl": "https://example.com/arthas.png",
  "description": "Un guerrero caído que domina el hielo."
}

// Response 201
{
  "message": "Guerrero creado.",
  "data": {
    "id": 1,
    "name": "Arthas",
    "raceId": 1,
    "powerId": 2,
    "spellId": 3,
    "imageUrl": "https://example.com/arthas.png",
    "description": "Un guerrero caído que domina el hielo."
  }
}
```

---

### 👥 Gestión de Usuarios

| Método     | Endpoint                | Descripción               | Body (JSON)                        |
| :--------- | :---------------------- | :------------------------ | :--------------------------------- |
| **GET**    | `/admin/users`          | Listar todos los usuarios | N/A                                |
| **PUT**    | `/admin/users/:id/role` | Cambiar rol de usuario    | `{ "role": "ADMIN" }` u `"PLAYER"` |
| **DELETE** | `/admin/users/:id`      | Eliminar un usuario       | N/A                                |

**Respuesta** `GET /admin/users`:

```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "createdAt": "2026-01-15T..."
  },
  {
    "id": 2,
    "username": "jugador1",
    "role": "PLAYER",
    "createdAt": "2026-02-01T..."
  }
]
```

**Ejemplo** — `PUT /admin/users/:id/role`:

```json
// Request
{ "role": "ADMIN" }

// Response 200
{
  "message": "Rol actualizado.",
  "data": { "id": 2, "username": "jugador1", "role": "ADMIN" }
}
```

> ⚠️ **Nota**: No puedes eliminarte a ti mismo (`DELETE /admin/users/:id` donde `:id` es tu propio ID devuelve error 400).

---

### 🌀 Gestión de Razas (`/admin/races`)

| Método     | Endpoint           | Descripción         | Body (JSON)                                       |
| :--------- | :----------------- | :------------------ | :------------------------------------------------ |
| **POST**   | `/admin/races`     | Crear una raza      | `{ "name": "Elfo", "description": "Raza ágil." }` |
| **PUT**    | `/admin/races/:id` | Actualizar una raza | Mismo formato que POST (campos opcionales).       |
| **DELETE** | `/admin/races/:id` | Eliminar una raza   | N/A                                               |

**Campos de Race:**

| Campo         | Tipo   | Obligatorio | Descripción                      |
| :------------ | :----- | :---------- | :------------------------------- |
| `name`        | String | ✅ Sí       | Nombre de la raza (máx. 50 char) |
| `description` | String | ❌ No       | Descripción de la raza (texto)   |

**Ejemplo Completo** — `POST /admin/races`:

```json
// Request
{ "name": "Elfo", "description": "Raza ágil y certera con arco." }

// Response 201
{
  "message": "Raza creada.",
  "data": { "id": 1, "name": "Elfo", "description": "Raza ágil y certera con arco." }
}
```

---

### ⚡ Gestión de Poderes (`/admin/powers`)

| Método     | Endpoint            | Descripción         | Body (JSON)                          |
| :--------- | :------------------ | :------------------ | :----------------------------------- |
| **POST**   | `/admin/powers`     | Crear un poder      | `{ "type": "Fuego", "value": 80 }`   |
| **PUT**    | `/admin/powers/:id` | Actualizar un poder | Mismo formato que POST (opcionales). |
| **DELETE** | `/admin/powers/:id` | Eliminar un poder   | N/A                                  |

**Campos de Power:**

| Campo   | Tipo   | Obligatorio | Descripción                          |
| :------ | :----- | :---------- | :----------------------------------- |
| `type`  | String | ✅ Sí       | Tipo/nombre del poder (máx. 50 char) |
| `value` | Int    | ✅ Sí       | Valor numérico del poder (puntos)    |

**Ejemplo Completo** — `POST /admin/powers`:

```json
// Request
{ "type": "Fuego", "value": 80 }

// Response 201
{
  "message": "Poder creado.",
  "data": { "id": 1, "type": "Fuego", "value": 80 }
}
```

---

### 🔮 Gestión de Hechizos (`/admin/spells`)

| Método     | Endpoint            | Descripción           | Body (JSON)                                |
| :--------- | :------------------ | :-------------------- | :----------------------------------------- |
| **POST**   | `/admin/spells`     | Crear un hechizo      | `{ "type": "Rayo de hielo", "value": 50 }` |
| **PUT**    | `/admin/spells/:id` | Actualizar un hechizo | Mismo formato que POST (opcionales).       |
| **DELETE** | `/admin/spells/:id` | Eliminar un hechizo   | N/A                                        |

**Campos de Spell:**

| Campo   | Tipo   | Obligatorio | Descripción                                 |
| :------ | :----- | :---------- | :------------------------------------------ |
| `type`  | String | ✅ Sí       | Tipo/nombre del hechizo (máx. 50 char)      |
| `value` | Int    | ❌ No       | Valor numérico del hechizo (puede ser null) |

**Ejemplo Completo** — `POST /admin/spells`:

```json
// Request
{ "type": "Rayo de hielo", "value": 50 }

// Response 201
{
  "message": "Hechizo creado.",
  "data": { "id": 1, "type": "Rayo de hielo", "value": 50 }
}
```

---

### 🎮 Gestión de Partidas (Admin)

| Método     | Endpoint             | Descripción               |
| :--------- | :------------------- | :------------------------ |
| **GET**    | `/admin/matches`     | Listar todas las partidas |
| **DELETE** | `/admin/matches/:id` | Eliminar una partida      |

**Respuesta** `GET /admin/matches`:

```json
[
  {
    "id": 1,
    "mode": "FIVE_VS_FIVE",
    "status": "FINISHED",
    "player1Id": 1,
    "player2Id": null,
    "winnerId": 1,
    "winnerSlot": 1,
    "player2Name": "Carlos",
    "reasonForWin": "admin gana con 150 pts vs 120 pts.",
    "createdAt": "2026-02-27T...",
    "player1": { "id": 1, "username": "admin" },
    "player2": null,
    "winner": { "id": 1, "username": "admin" }
  }
]
```

---

## 💡 Guía de Pruebas — Flujo Completo de una Batalla

1. **Login**: `POST /auth/login` con `admin/admin123`. Copiar el `token`.
2. **Crear partida**: `POST /matches` con `player1Id`, `player2Name` y `mode`.
3. **Seleccionar J1**: `POST /matches/:id/selections` con `playerSlot: 1` y sus `warriorIds`.
4. **Seleccionar J2**: `POST /matches/:id/selections` con `playerSlot: 2` y sus `warriorIds`.
5. **Ejecutar batalla**: `POST /matches/:id/battle`. Verificar `winnerSlot`, totales y `reason`.
6. **Ver ranking**: `GET /ranking`. Verificar que J1 y J2 aparecen con stats independientes.
