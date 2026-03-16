# Task Management System — Spring Boot + MySQL

A RESTful backend for managing tasks with JWT-based authentication.

---

## Tech Stack
- **Spring Boot 3.2**
- **Spring Security + JWT**
- **Spring Data JPA + Hibernate**
- **MySQL**
- **Lombok**

---

## Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE taskdb;
```

### 2. Configure Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### 3. Run the App
```bash
mvn spring-boot:run
```
Tables are auto-created via `spring.jpa.hibernate.ddl-auto=update`.

---

## Project Structure
```
src/main/java/com/example/taskmanagement/
├── controller/
│   ├── AuthController.java      # Register & Login
│   └── TaskController.java      # CRUD for Tasks
├── service/
│   ├── AuthService.java
│   └── TaskService.java
├── model/
│   ├── User.java                # User entity
│   └── Task.java                # Task entity (status, priority, dueDate)
├── repository/
│   ├── UserRepository.java
│   └── TaskRepository.java
├── dto/
│   ├── AuthDTO.java             # Register/Login request + response
│   └── TaskDTO.java             # Task request + response
├── security/
│   ├── JwtUtils.java            # Token generation & validation
│   ├── JwtAuthFilter.java       # JWT filter on every request
│   └── SecurityConfig.java      # Spring Security config
└── exception/
    └── GlobalExceptionHandler.java
```

---

## API Endpoints

### Auth (Public)
| Method | Endpoint           | Description     |
|--------|--------------------|-----------------|
| POST   | /api/auth/register | Register a user |
| POST   | /api/auth/login    | Login & get JWT |

#### Register
```json
POST /api/auth/register
{
  "name": "Arman",
  "email": "arman@example.com",
  "password": "secret123"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "arman@example.com",
  "password": "secret123"
}
// Response: { "token": "eyJ...", "email": "...", "name": "..." }
```

---

### Tasks (JWT Required)
Add `Authorization: Bearer <token>` header to all task requests.

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | /api/tasks      | Create a task            |
| GET    | /api/tasks      | Get all tasks (+ filter) |
| GET    | /api/tasks/{id} | Get task by ID           |
| PUT    | /api/tasks/{id} | Update a task            |
| DELETE | /api/tasks/{id} | Delete a task            |

#### Create Task
```json
POST /api/tasks
{
  "title": "Build REST API",
  "description": "Task management project",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-04-01"
}
```

#### Filter Tasks
```
GET /api/tasks?status=TODO
GET /api/tasks?priority=HIGH
```

#### Update Task
```json
PUT /api/tasks/1
{
  "status": "IN_PROGRESS"
}
```

---

## Enums

**Status:** `TODO` | `IN_PROGRESS` | `DONE`

**Priority:** `LOW` | `MEDIUM` | `HIGH`

---

## Testing with Postman
1. Register → POST `/api/auth/register`
2. Login → POST `/api/auth/login` → copy the `token`
3. In Postman, go to **Authorization** → **Bearer Token** → paste token
4. Hit any `/api/tasks` endpoint
