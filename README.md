# 🌿 CarbonTrace — Carbon Footprint Awareness Platform

> **[Challenge 3] Carbon Footprint Awareness Platform**
> Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.



---

## 👨‍💻 Built By

**Vijan Arora**
BCA Student — DIT University, Dehradun, Uttarakhand

- LinkedIn: [linkedin.com/in/vijan-arora-](https://linkedin.com/in/vijan-arora-)
- GitHub: [github.com/Vijan-arora](https://github.com/Vijan-arora)

---

## 🌍 Problem Statement

The average person generates **4–14 kg of CO₂ per day** through transport, food, energy, and shopping — yet most people have no visibility into their personal impact. CarbonTrace solves this by making carbon tracking as simple as logging a meal: fast, visual, and actionable.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Animated Carbon Dial** | Real-time SVG arc dial showing daily CO₂ vs. world average (14.2 kg/day) |
| 📊 **Category Breakdown** | Transport, Energy, Food, and Shopping tracked separately with trend indicators |
| 📝 **Activity Logger** | Log any activity in seconds using 25+ pre-seeded emission factors |
| 📈 **Weekly & Monthly Reports** | Bar and line charts with personal goal overlays |
| 🔥 **Streak Tracker** | Gamified daily goal streaks to build sustainable habits |
| 💡 **Personalized Tips** | Context-aware reduction suggestions based on your highest emission category |
| 🌙 **Dark Mode** | Full dark mode with system preference detection |
| 📱 **Responsive Design** | Mobile-first, works on all screen sizes |
| 🔐 **JWT Authentication** | Secure email + password login with per-user data isolation |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + Vite — fast, modern UI
- **Tailwind CSS v3** — utility-first styling
- **Recharts** — interactive data visualizations
- **React Router v6** — client-side routing
- **Axios** — API communication with JWT interceptor
- **React Hook Form** — form validation

### Backend
- **Node.js 20** + **Express.js** — REST API server
- **Prisma ORM** + **PostgreSQL** — type-safe database access
- **bcryptjs** — password hashing (10 rounds)
- **jsonwebtoken** — JWT auth (7-day expiry)
- **Concurrently** + **Nodemon** — smooth dev experience

---

## 📁 Project Structure

```
carbontrace/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # CarbonDial, CategoryCards, WeeklyChart, etc.
│   │   ├── pages/             # Dashboard, Login, Register, Reports, Settings
│   │   ├── context/           # AuthContext, LogContext
│   │   ├── api/               # Axios instance with JWT interceptor
│   │   └── main.jsx
│   └── vite.config.js         # Proxy: /api → localhost:5000
├── server/                    # Node.js + Express backend
│   ├── routes/                # auth.js, logs.js, stats.js, user.js, factors.js
│   ├── middleware/            # auth.js (JWT verification)
│   ├── controllers/           # Business logic per route
│   ├── prisma/
│   │   ├── schema.prisma      # User, ActivityLog, EmissionFactor models
│   │   └── seed.js            # 25+ emission factors pre-seeded
│   └── index.js
├── .env.example
├── package.json               # Root: concurrently scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Vijan-arora/Carbon-Footprints.git
cd Carbon-Footprints
```

### 2. Set up environment variables

```bash
cp .env.example server/.env
```

Edit `server/.env`:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/carbontrace
JWT_SECRET=your_secure_secret_at_least_32_characters
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Create the PostgreSQL database

```bash
createdb carbontrace
```

### 4. Install dependencies and set up database

```bash
npm run setup
```

This single command: installs all dependencies → runs Prisma migrations → seeds 25+ emission factors.

### 5. Start the development server

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account → returns JWT |
| POST | `/api/auth/login` | Login → returns JWT + user |

### Activity Logs *(requires Bearer token)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs?date=YYYY-MM-DD` | Get logs for a specific date |
| POST | `/api/logs` | Create a log entry |
| DELETE | `/api/logs/:id` | Delete a log (owner only) |

### Statistics *(requires Bearer token)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/weekly` | Last 7 days — totals, best/worst day |
| GET | `/api/stats/monthly` | Last 30 days — totals, savings vs world avg |

### User & Factors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user profile |
| PUT | `/api/user/goal` | Update daily CO₂ goal |
| GET | `/api/factors` | Get all emission factors by category |

---

## 📊 Emission Factors (Pre-seeded)

### 🚗 Transport (8 factors)
| Activity | CO₂ Factor | Unit |
|----------|-----------|------|
| Petrol Car | 0.21 kg | per km |
| Diesel Car | 0.19 kg | per km |
| Bus | 0.089 kg | per km |
| Metro | 0.041 kg | per km |
| Bicycle | 0 kg | per km |
| Domestic Flight | 0.255 kg | per km |
| Auto-Rickshaw | 0.075 kg | per km |
| Electric Car | 0.053 kg | per km |

### ⚡ Energy (6 factors)
| Activity | CO₂ Factor | Unit |
|----------|-----------|------|
| Electricity (India grid) | 0.708 kg | per kWh |
| LPG Cooking | 0.52 kg | per hour |
| Diesel Generator | 2.68 kg | per hour |
| Air Conditioner | 1.06 kg | per hour |
| Water Heater | 2.12 kg | per hour |
| Ceiling Fan | 0.05 kg | per hour |

### 🥗 Food (7 factors)
| Activity | CO₂ Factor | Unit |
|----------|-----------|------|
| Beef Meal | 6.0 kg | per meal |
| Chicken Meal | 1.8 kg | per meal |
| Vegetarian Meal | 0.8 kg | per meal |
| Vegan Meal | 0.4 kg | per meal |
| Dairy | 1.2 kg | per 100g |
| Eggs | 0.25 kg | per unit |
| Rice | 0.28 kg | per 100g |

### 🛍️ Shopping (4 factors)
| Activity | CO₂ Factor | Unit |
|----------|-----------|------|
| New Clothing Item | 15.0 kg | per item |
| Electronics Device | 350.0 kg | per device |
| Online Delivery Package | 0.5 kg | per package |
| Plastic Bag | 0.08 kg | per bag |

---

## 🗄️ Database Schema

```prisma
model User {
  id             Int           @id @default(autoincrement())
  name           String
  email          String        @unique
  password_hash  String
  daily_goal_kg  Float         @default(6.0)
  streak_days    Int           @default(0)
  created_at     DateTime      @default(now())
  logs           ActivityLog[]
}

model ActivityLog {
  id              Int      @id @default(autoincrement())
  user_id         Int
  category        String
  activity_name   String
  quantity        Float
  emission_factor Float
  total_kg        Float
  logged_at       DateTime @default(now())
  user            User     @relation(fields: [user_id], references: [id])
}

model EmissionFactor {
  id              Int    @id @default(autoincrement())
  category        String
  name            String
  factor_per_unit Float
  unit            String
  description     String
}
```

---

## 🔄 Reset Database

```bash
cd server
npx prisma migrate reset --force
npx prisma db seed
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---



Built with 💚 for a greener planet by **Vijan Arora**

*DIT University, Dehradun · BCA 2024–2027*
