# 🏹 Hunter System

> A Solo Leveling-inspired full-stack task management app with XP, levels, and hunter ranks.
> Built as a personal productivity tool with ADHD-friendly gamification.

---

## 🚀 Tech Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Backend    | Spring Boot 3.2, Java 17         |
| Database   | MySQL 8                          |
| ORM        | Spring Data JPA / Hibernate      |
| Auth       | Spring Security + JWT            |
| Frontend   | React 18, Vite, React Router     |
| Mobile     | React Native (Expo)              |
| Health     | Health Connect (Android)         |
| Styling    | CSS Modules, Tailwind, NextUI    |
| Theme      | Solo Leveling dark theme         |

---

## ✅ Features

### Backend

- JWT authentication (register, login, stateless sessions)
- Full quest CRUD with priority-based XP multipliers (LOW ×1, MEDIUM ×1.5, HIGH ×2)
- Hunter rank system: E → D → C → B → A → S
- Auto level calculation (every 100 XP = 1 level)
- Categories and tags (scoped per user)
- Recurring daily quests — habit templates that auto-spawn at midnight
- Achievements/Badges — 16 badges across quest, rank, XP, and streak categories
- Subtasks with completion tracking
- Streak tracking for consecutive daily completions
- Profile management with password reset
- Rate limiting on auth endpoints (5 attempts, 15min lock)
- Global error handling and CORS configuration

### Frontend

- Login + Register pages with protected routes
- Dashboard with real-time status panel
- Quest board with filters (All / Active / In Progress / Completed / High Priority)
- Search, sorting (by due date, priority, XP), and pagination
- Create quest form with title, description, priority, XP reward, due date
- Complete quest with XP popup and rank-up notifications
- Overdue quest detection
- Health sync dashboard (steps, heart rate, sleep)
- Responsive layout with Solo Leveling dark theme

### Mobile App (React Native / Expo)

- Full quest management on mobile
- Health Connect integration for Android wearables
- Native animations and pull-to-refresh

---

## 🔲 Planned Features

- [ ] **ADHD Tracker** — mood log, trigger tracker, medication reminders
- [ ] **Leaderboard** — global rankings by XP

---

## 🗂 Project Structure

```
task-management/
├── src/main/java/com/example/taskmanagement/
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   ├── model/               # JPA entities
│   ├── repository/          # Spring Data JPA
│   ├── dto/                 # Request/Response objects
│   ├── security/            # JWT filter, config, CORS
│   └── exception/           # Global error handler
├── src/main/resources/
│   └── application.properties
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext (global state)
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API client
│   │   └── index.css        # Global styles
│   └── package.json
├── mobile/                  # React Native app
│   ├── app/                 # Expo Router screens
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

---

## 🔌 API Endpoints

### Auth (public)

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | /api/auth/register | Register new hunter   |
| POST   | /api/auth/login    | Login + get JWT token |

### Quests (JWT required)

| Method | Endpoint                 | Description                                |
| ------ | ------------------------ | ------------------------------------------ |
| GET    | /api/tasks               | Get all quests (filter, sort, paginate)    |
| GET    | /api/tasks/search?q=     | Search by title/description                |
| POST   | /api/tasks               | Create quest                               |
| GET    | /api/tasks/{id}          | Get quest by ID                            |
| PUT    | /api/tasks/{id}          | Update quest                               |
| PATCH  | /api/tasks/{id}/complete | Complete quest + award XP                  |
| DELETE | /api/tasks/{id}          | Delete quest                               |

### Hunter Status (JWT required)

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | /api/user/status | Level, XP, rank, quests completed |
| GET    | /api/user/profile| Get user profile                  |
| PUT    | /api/user/profile| Update profile                    |
| GET    | /api/user/streak | Get current streak                |

### Categories & Tags (JWT required)

| Method     | Endpoint             | Description               |
| ---------- | -------------------- | ------------------------- |
| GET/POST   | /api/categories      | List or create categories |
| PUT/DELETE | /api/categories/{id} | Update or delete category |
| GET/POST   | /api/tags            | List or create tags       |
| PUT/DELETE | /api/tags/{id}       | Update or delete tag      |

### Recurring Quests (JWT required)

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | /api/recurring       | List recurring quest templates       |
| POST   | /api/recurring       | Create recurring quest template      |
| PUT    | /api/recurring/{id}  | Update recurring quest               |
| DELETE | /api/recurring/{id}  | Deactivate recurring quest           |

### Achievements (JWT required)

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | /api/achievements          | All achievements with status    |
| GET    | /api/achievements/unlocked | User's unlocked badges          |

---

## ⚡ XP System

| Priority | XP Multiplier | Example (100 XP quest) |
| -------- | ------------- | ---------------------- |
| LOW      | ×1.0          | 100 XP                 |
| MEDIUM   | ×1.5          | 150 XP                 |
| HIGH     | ×2.0          | 200 XP                 |

### Hunter Ranks

| Rank   | XP Required        | Level Range |
| ------ | ------------------ | ----------- |
| E Rank | 0 – 999 XP         | 1 – 9       |
| D Rank | 1,000 – 2,999 XP   | 10 – 29     |
| C Rank | 3,000 – 5,999 XP   | 30 – 59     |
| B Rank | 6,000 – 9,999 XP   | 60 – 99     |
| A Rank | 10,000 – 14,999 XP | 100 – 149   |
| S Rank | 15,000+ XP         | 150+        |

---

## 🛠 Running Locally

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8
- Node.js 18+

### Option 1: Docker (Recommended)

```bash
# Start all services (backend + database + frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL: localhost:3306

### Option 2: Manual Setup

```bash
# 1. Create MySQL database
mysql -u root -p
CREATE DATABASE taskdb;

# 2. Configure database credentials
# Edit src/main/resources/application.properties

# 3. Start backend
cd task-management
mvn spring-boot:run

# 4. Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

Access: http://localhost:5173

---

## 🧠 ADHD Design Philosophy

This app is built with ADHD in mind:

- **Gamification** — dopamine hits for completing tasks
- **Visual rank progression** — long-term motivation
- **Priority system** — focus on what matters most
- **XP multipliers** — reward tackling hard tasks
- **Health tracking** — sleep, heart rate, steps from your watch
- **Planned:** mood tracking, trigger logging, med reminders

---

## 📝 License

MIT
