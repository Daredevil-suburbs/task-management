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

---

## 🔲 What's Not Done Yet

### High Priority

- [ ] **ADHD Tracker** — mood log, trigger tracker, med tracker
- [ ] **Recurring daily quests** — habits like "take meds", "drink water"
- [ ] **Achievements / Badges** — "Complete 10 quests", "Reach B Rank"
- [ ] **Android companion app** — reads Mi Watch data via Health Connect

### Medium Priority

- [ ] **Subtasks** — checklist items inside a quest
- [ ] **Quest search** — search by title/description
- [ ] **Sorting** — by due date, priority, XP reward
- [ ] **Pagination** — for users with many quests
- [ ] **Profile editing** — change name, password
- [ ] **Password reset** — forgot password flow
- [ ] **Streak tracking** — consecutive days completing quests

### Polish & Production

- [ ] **Swagger / OpenAPI docs** — auto-generated API documentation
- [ ] **Docker setup** — Dockerfile + docker-compose for easy deployment
- [ ] **Unit + integration tests** — service and controller tests
- [ ] **Rate limiting** — brute-force protection on login
- [ ] **Environment variables** — move JWT secret out of properties file
- [ ] **Leaderboard** — top hunters by XP

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
│   │   └── UserController
│   ├── service/             # Business logic
│   │   ├── AuthService
│   │   ├── TaskService
│   │   ├── CategoryService
│   │   ├── TagService
│   │   ├── UserService
│   │   └── LevelService     # XP + rank engine
│   ├── model/               # JPA entities
│   │   ├── User
│   │   ├── Task
│   │   ├── Category
│   │   ├── Tag
│   │   └── HunterRank       # E, D, C, B, A, S enum
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
| GET    | /api/tasks               | Get all quests (filter by status/priority) |
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

---

## 🧠 ADHD Design Philosophy

This app is built with ADHD in mind:

- **Gamification** gives dopamine hits for completing tasks
- **Visual rank progression** creates long-term motivation
- **Priority system** helps focus on what matters most
- **XP multipliers** reward tackling hard tasks
- **Planned:** mood tracking, trigger logging, med reminders, watch data integration
