# 🏹 Hunter System

> A Solo Leveling-inspired full-stack task management app with XP, levels, and hunter ranks.
> Built as a personal productivity tool with ADHD-friendly gamification.

---

## 🚀 Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Backend  | Spring Boot 3.2, Java 17              |
| Database | MySQL 8                               |
| ORM      | Spring Data JPA / Hibernate           |
| Auth     | Spring Security + JWT                 |
| Frontend | React 18, Vite, React Router          |
| Mobile   | React Native (Expo), Expo Router      |
| Health   | Health Connect (Android)              |
| Styling  | CSS Modules, Solo Leveling dark theme |

---

## ✅ What's Done

### Backend

- JWT authentication (register, login, stateless sessions)
- Full quest CRUD (create, read, update, delete)
- Quest completion with XP rewards
- Priority-based XP multipliers (LOW ×1, MEDIUM ×1.5, HIGH ×2)
- Hunter rank system: E → D → C → B → A → S
- Auto level calculation (every 100 XP = 1 level)
- Categories (scoped per user)
- Tags (many-to-many with quests)
- User status endpoint (level, XP, rank, quests completed)
- Global error handling
- CORS configuration for frontend
- **Recurring daily quests** — habit templates that auto-spawn daily tasks at midnight
- **Achievements / Badges** — 16 badges across quest, rank, XP, and streak categories; auto-evaluated on quest completion

### Frontend

- Login + Register pages
- Protected routes (JWT stored in localStorage)
- Auto logout on token expiry
- Dashboard with sidebar status panel
- Rank badge, level, XP progress bar
- Quest board with filters (All / Active / In Progress / Completed / High)
- Create quest form (title, description, priority, XP reward, due date)
- Complete quest → XP popup + rank-up banner
- Overdue quest detection
- Responsive layout (mobile friendly)
- Solo Leveling dark theme (black + purple + gold)

### Mobile App (React Native / Expo)

- Full port of web frontend to React Native
- Expo Router for navigation (login, register, dashboard)
- AsyncStorage for JWT persistence
- Health Connect integration (steps, heart rate, sleep)
- Health data sync — reads from watch, stores to backend
- Animated XP progress bar with Linear Gradient
- Native pull-to-refresh on quest list
- Slide-up modal for quest creation
- Health stats dashboard card (Steps, Avg HR, Sleep)

---

## 🔲 What's Not Done Yet

### High Priority

- [x] **Recurring daily quests** — habits like "take meds", "drink water" ✅
- [x] **Achievements / Badges** — "Complete 10 quests", "Reach B Rank" ✅
- [ ] **ADHD Tracker** — mood log, trigger tracker, med tracker
- [x] **Android companion app** — reads Mi Watch data via Health Connect ✅

### Medium Priority

- [x] **Subtasks** — checklist items inside a quest ✅
- [x] **Quest search** — search by title/description ✅
- [x] **Sorting** — by due date, priority, XP reward ✅
- [x] **Pagination** — for users with many quests ✅
- [x] **Profile editing** — change name, password ✅
- [x] **Password reset** — forgot password flow ✅
- [x] **Streak tracking** — consecutive days completing quests ✅

### Polish & Production

- [x] **Swagger / OpenAPI docs** — auto-generated API documentation ✅
- [x] **Docker setup** — Dockerfile + docker-compose for easy deployment ✅
- [x] **Unit + integration tests** — service and controller tests (55 tests) ✅
- [x] **Rate limiting** — brute-force protection on login (5 attempts, 15min lock) ✅
- [x] **Environment variables** — JWT secret + DB creds externalized ✅
- [x] **Leaderboard** — top hunters by XP ✅

---

## 🗂 Project Structure

```
task-management/
├── src/main/java/com/example/taskmanagement/
│   ├── controller/          # REST endpoints
│   │   ├── AuthController
│   │   ├── TaskController
│   │   ├── CategoryController
│   │   ├── TagController
│   │   ├── UserController
│   │   ├── RecurringQuestController
│   │   └── AchievementController
│   ├── service/             # Business logic
│   │   ├── AuthService
│   │   ├── TaskService
│   │   ├── CategoryService
│   │   ├── TagService
│   │   ├── UserService
│   │   ├── LevelService          # XP + rank engine
│   │   ├── RecurringQuestService  # Habit CRUD + daily spawn
│   │   ├── AchievementService     # Badge check + award engine
│   │   ├── AchievementSeeder      # Seeds badge definitions on startup
│   │   └── DailyQuestScheduler    # Midnight cron job
│   ├── model/               # JPA entities
│   │   ├── User
│   │   ├── Task
│   │   ├── Category
│   │   ├── Tag
│   │   ├── HunterRank       # E, D, C, B, A, S enum
│   │   ├── RecurringQuest   # Daily habit templates
│   │   ├── Achievement      # Badge definitions
│   │   └── UserAchievement  # User ↔ Achievement unlock records
│   ├── repository/          # Spring Data JPA
│   ├── dto/                 # Request + Response objects
│   ├── security/            # JWT filter, config, CORS
│   └── exception/           # Global error handler
├── src/main/resources/
│   └── application.properties
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # StatusPanel, QuestCard, QuestList, AddQuest
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── services/        # api.js (axios + JWT interceptor)
│   │   └── index.css        # Global Solo Leveling theme
│   ├── package.json
│   └── vite.config.js
├── mobile/                  # React Native app (Expo)
│   ├── app/                 # Expo Router screens
│   │   ├── _layout.js       # Root layout with AuthProvider
│   │   ├── index.js         # Auth redirect
│   │   ├── login.js         # Hunter login screen
│   │   ├── register.js      # Hunter registration screen
│   │   └── dashboard.js     # Quest board + health stats
│   ├── src/
│   │   ├── components/      # StatusPanel, QuestCard, QuestList, AddQuest, XPProgressBar
│   │   ├── context/         # AuthContext (AsyncStorage-based)
│   │   ├── services/        # api.js + health.js (Health Connect)
│   │   └── theme.js         # Solo Leveling color tokens
│   ├── app.json
│   └── package.json
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
| GET    | /api/tasks               | Get all quests (filter by status/priority, sort, paginate) |
| GET    | /api/tasks/search?q=     | Search quests by title/description         |
| POST   | /api/tasks               | Create quest                               |
| GET    | /api/tasks/{id}          | Get quest by ID                            |
| PUT    | /api/tasks/{id}          | Update quest                               |
| PATCH  | /api/tasks/{id}/complete | Complete quest + award XP                  |
| DELETE | /api/tasks/{id}          | Delete quest                               |

### Hunter Status (JWT required)

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | /api/user/status | Level, XP, rank, quests completed |

### Categories & Tags (JWT required)

| Method     | Endpoint             | Description               |
| ---------- | -------------------- | ------------------------- |
| GET/POST   | /api/categories      | List or create categories |
| PUT/DELETE | /api/categories/{id} | Update or delete category |
| GET/POST   | /api/tags            | List or create tags       |
| PUT/DELETE | /api/tags/{id}       | Update or delete tag      |

### Health (JWT required)

| Method | Endpoint              | Description                             |
| ------ | --------------------- | --------------------------------------- |
| POST   | /api/health/sync      | Sync today's health data from phone     |
| GET    | /api/health/today     | Get today's health record               |
| GET    | /api/health/history   | Get health history (query: ?days=7)     |

### Recurring Quests (JWT required)

| Method | Endpoint                 | Description                                |
| ------ | ------------------------ | ------------------------------------------ |
| GET    | /api/recurring           | List all recurring quest templates         |
| POST   | /api/recurring           | Create a recurring quest template          |
| GET    | /api/recurring/{id}      | Get a specific recurring quest             |
| PUT    | /api/recurring/{id}      | Update a recurring quest template          |
| DELETE | /api/recurring/{id}      | Deactivate (soft delete) a recurring quest |
| POST   | /api/recurring/spawn     | Manually trigger daily quest creation      |

### Achievements (JWT required)

| Method | Endpoint                   | Description                                |
| ------ | -------------------------- | ------------------------------------------ |
| GET    | /api/achievements          | All achievements with unlock status        |
| GET    | /api/achievements/unlocked | Only the user's unlocked badges            |

### Subtasks (JWT required)

| Method | Endpoint                        | Description                           |
| ------ | ------------------------------- | ------------------------------------- |
| GET    | /api/tasks/{taskId}/subtasks    | Get all subtasks for a quest          |
| POST   | /api/tasks/{taskId}/subtasks    | Create a subtask                      |
| PUT    | /api/tasks/{taskId}/subtasks/{id} | Update a subtask                    |
| PATCH  | /api/tasks/{taskId}/subtasks/{id}/toggle | Toggle subtask completion |
| DELETE | /api/tasks/{taskId}/subtasks/{id} | Delete a subtask                    |

### Profile (JWT required)

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | /api/user/profile     | Get user profile                      |
| PUT    | /api/user/profile     | Update profile (name, password)       |
| GET    | /api/user/streak      | Get current streak                    |
| POST   | /api/user/password/reset-request | Request password reset (returns token) |
| POST   | /api/user/password/reset-confirm | Confirm password reset with token     |

### Query Parameters

#### GET /api/tasks

| Parameter | Type   | Description                              |
| --------- | ------ | ---------------------------------------- |
| status    | string | Filter by status: TODO, IN_PROGRESS, DONE |
| priority  | string | Filter by priority: LOW, MEDIUM, HIGH    |
| sortBy    | string | Sort field: dueDate, priority, xpReward, createdAt |
| sortDir   | string | Sort direction: asc, desc (default: asc) |
| page      | int    | Page number (1-indexed)                  |
| size      | int    | Items per page                           |

#### GET /api/tasks/search

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| q         | string | Search query (title/description) |

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

### Backend

```bash
# 1. Create MySQL database
mysql -u root -p
CREATE DATABASE taskdb;

# 2. Update credentials
# edit task-management/src/main/resources/application.properties

# 3. Run
cd task-management
mvn spring-boot:run
```

### Frontend

```bash
cd task-management/frontend
npm install
npm run dev
```

Open 👉 http://localhost:5173

### Mobile App

```bash
cd task-management/mobile
npm install

# Development (Expo Go — no Health Connect)
npx expo start

# Production build with Health Connect (requires Android SDK)
npx expo prebuild --platform android --clean
npx expo run:android
```

> ⚠️ Health Connect features require a **development build** (`npx expo run:android`).
> Expo Go only works for the quest board features.

---

## 🧠 ADHD Design Philosophy

This app is built with ADHD in mind:

- **Gamification** gives dopamine hits for completing tasks
- **Visual rank progression** creates long-term motivation
- **Priority system** helps focus on what matters most
- **XP multipliers** reward tackling hard tasks
- **Health tracking** — sleep, heart rate, and steps from your watch, synced daily
- **Planned:** mood tracking, trigger logging, med reminders
