# CarbonTrace - Carbon Footprint Awareness Platform

A full-stack web application for tracking and reducing your personal carbon footprint. Monitor daily activities, visualize emissions trends, and get personalized tips for sustainable living.

## Features

- **Activity Logging**: Track transport, energy use, food consumption, and shopping habits
- **Real-time Dashboard**: Animated carbon dial showing daily progress against personal goals
- **Category Analysis**: Breakdown by Transport, Energy, Food, and Shopping with trend indicators
- **Weekly & Monthly Reports**: Visual charts with goal overlays and comparisons
- **Streak Tracking**: Gamification through daily goal achievements
- **Personalized Tips**: Context-aware suggestions for reducing emissions
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first design for all screen sizes

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v3
- Recharts (data visualization)
- React Router v6
- Axios
- React Hook Form

### Backend
- Node.js 20 + Express.js
- Prisma ORM
- PostgreSQL
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

### Dev Tools
- Nodemon (auto-restart)
- Concurrently (parallel scripts)

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/carbontrace.git
cd carbontrace
```

### 2. Copy environment file

```bash
cp .env.example server/.env
```

Edit `server/.env` with your database credentials:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/carbontrace
JWT_SECRET=your_secure_secret_at_least_32_characters
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Create PostgreSQL database

```bash
createdb carbontrace
```

Or using psql:
```sql
CREATE DATABASE carbontrace;
```

### 4. Install dependencies and setup

```bash
npm run setup
```

This command:
1. Installs root dependencies
2. Installs client dependencies
3. Installs server dependencies
4. Runs Prisma migrations
5. Seeds the database with emission factors

### 5. Start development server

```bash
npm run dev
```

This runs both frontend and backend concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Documentation

### Authentication

#### POST /api/auth/register

Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "daily_goal_kg": 6.0,
    "streak_days": 0
  }
}
```

#### POST /api/auth/login

Authenticate an existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** Same as register

---

### Activity Logs

#### GET /api/logs?date=YYYY-MM-DD

Get all activity logs for a specific date.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "category": "Transport",
    "activity_name": "Petrol Car",
    "quantity": 10,
    "emission_factor": 0.21,
    "total_kg": 2.1,
    "logged_at": "2024-01-15T08:30:00.000Z"
  }
]
```

#### POST /api/logs

Create a new activity log.

**Request:**
```json
{
  "category": "Transport",
  "activity_name": "Petrol Car",
  "quantity": 10,
  "emission_factor": 0.21
}
```

**Response:** The created log object with calculated `total_kg`

#### DELETE /api/logs/:id

Delete an activity log (only if owned by authenticated user).

---

### Statistics

#### GET /api/stats/weekly

Get weekly statistics (last 7 days).

**Response:**
```json
{
  "days": [
    { "date": "2024-01-09", "total": 5.2 },
    { "date": "2024-01-10", "total": 3.8 }
  ],
  "bestDay": { "date": "2024-01-10", "total": 3.8 },
  "worstDay": { "date": "2024-01-09", "total": 5.2 },
  "goal": 6.0,
  "weekTotal": 9.0
}
```

#### GET /api/stats/monthly

Get monthly statistics (last 30 days).

**Response:**
```json
{
  "days": [...],
  "monthTotal": 150.5,
  "worldAvgDaily": 4.0,
  "savedVsWorldAvg": 30.5,
  "goal": 6.0
}
```

---

### User Settings

#### GET /api/user/me

Get current user profile.

#### PUT /api/user/goal

Update daily goal.

**Request:**
```json
{
  "daily_goal_kg": 5.5
}
```

---

### Emission Factors

#### GET /api/factors

Get all emission factors grouped by category.

**Response:**
```json
{
  "Transport": [
    {
      "id": 1,
      "category": "Transport",
      "name": "Petrol Car",
      "factor_per_unit": 0.21,
      "unit": "km",
      "description": "Average petrol car emissions per kilometer"
    }
  ],
  "Energy": [...],
  "Food": [...],
  "Shopping": [...]
}
```

## Emission Factors

The app includes 25+ pre-seeded emission factors across 4 categories:

### Transport (8 factors)
| Activity | Factor | Unit |
|----------|--------|------|
| Petrol Car | 0.21 kg | km |
| Diesel Car | 0.19 kg | km |
| Bus | 0.089 kg | km |
| Metro | 0.041 kg | km |
| Bicycle | 0 kg | km |
| Domestic Flight | 0.255 kg | km |
| Auto-Rickshaw | 0.075 kg | km |
| Electric Car | 0.053 kg | km |

### Energy (6 factors)
| Activity | Factor | Unit |
|----------|--------|------|
| Electricity | 0.708 kg | kWh |
| LPG Cooking | 0.52 kg | hour |
| Diesel Generator | 2.68 kg | hour |
| Air Conditioner | 1.06 kg | hour |
| Water Heater | 2.12 kg | hour |
| Ceiling Fan | 0.05 kg | hour |

### Food (7 factors)
| Activity | Factor | Unit |
|----------|--------|------|
| Beef Meal | 6.0 kg | meal |
| Chicken Meal | 1.8 kg | meal |
| Vegetarian Meal | 0.8 kg | meal |
| Vegan Meal | 0.4 kg | meal |
| Dairy | 1.2 kg | 100g |
| Eggs | 0.25 kg | unit |
| Rice | 0.28 kg | 100g |

### Shopping (4 factors)
| Activity | Factor | Unit |
|----------|--------|------|
| New Clothing Item | 15.0 kg | item |
| Electronics Device | 350.0 kg | device |
| Online Delivery Package | 0.5 kg | package |
| Plastic Bag | 0.08 kg | bag |

## Screenshots

[Placeholder for screenshots]

## Reset Database

To reset the database and reseed:

```bash
cd server
npx prisma migrate reset
npx prisma db seed
```

Or to completely reset and start fresh:

```bash
cd server
npx prisma migrate reset --force
npm run prisma:migrate
npm run prisma:seed
```

## Project Structure

```
carbontrace/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── context/           # React Context providers
│   │   ├── api/               # API configuration
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── vite.config.js
├── server/                    # Express backend
│   ├── routes/                # API route definitions
│   ├── middleware/            # Custom middleware
│   ├── controllers/           # Route handlers
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Emission factors seed
│   └── index.js               # Server entry point
├── .env.example
├── package.json               # Root package with scripts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.
