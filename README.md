# Planify — University Timetable Management System

A full-stack web application for automated university timetable generation using **OptaPlanner**. Built with Spring Boot (Java 17), Next.js 14 (TypeScript), MySQL 8, and Docker.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Quick Start (Docker)](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Test Accounts](#test-accounts)
7. [API Documentation](#api-documentation)
8. [OptaPlanner Design](#optaplanner-design)

---

## Project Description

Planify automates the creation of university timetables by solving complex scheduling constraints using OptaPlanner (Constraint Programming). It supports:

- **Role-based access**: Admin, Department Head, Professor, Student
- **Automatic timetable generation** with hard/soft constraints (OptaPlanner)
- **2FA authentication** (TOTP / Google Authenticator)
- **Real-time timetable visualization** with interactive grid
- **Resource management**: Professors, Subjects, Classrooms, Student Groups, Time Slots

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Spring Boot 3.2 (Java 17) |
| Optimization Engine | **OptaPlanner 9.44** (integrated) |
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + custom design system |
| Database | MySQL 8.0 |
| Auth | JWT + TOTP 2FA (Google Authenticator) |
| Security | Spring Security, BCrypt |
| DB Migration | Flyway |
| API Docs | SpringDoc OpenAPI (Swagger) |
| Containerization | Docker + Docker Compose |

---

## Architecture

```
planify/
├── backend/           # Spring Boot application
│   ├── config/        # Security, OpenAPI configuration
│   ├── security/      # JWT, UserDetails, TOTP
│   ├── model/         # JPA entities + enums
│   ├── repository/    # Spring Data JPA repositories
│   ├── dto/           # Request/Response DTOs
│   ├── service/       # Business logic
│   ├── controller/    # REST controllers
│   ├── exception/     # Global exception handling
│   ├── aspect/        # AOP logging
│   └── optaplanner/   # OptaPlanner domain, constraints, solver
│       ├── domain/    # TimeTable (PlanningSolution), Lesson (PlanningEntity)
│       ├── constraints/ # TimeTableConstraintProvider
│       └── service/   # TimetableSolverService (E2E pipeline)
│
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # App Router pages
│       │   ├── (auth)/      # Login, 2FA verification
│       │   └── (dashboard)/ # Protected dashboard pages
│       ├── components/      # Reusable UI components
│       ├── lib/             # API client, utilities
│       ├── store/           # Zustand auth state
│       └── types/           # TypeScript type definitions
│
├── database/          # Flyway migrations (V1, V2)
├── docker-compose.yml
├── .env
└── README.md
```

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Ports 3000, 8080, 3306 available

### Steps

```bash
# 1. Clone / navigate to project
cd planify

# 2. Start all services
docker-compose up --build

# Services start in order:
#   mysql   → waits for health check
#   backend → waits for mysql
#   frontend → waits for backend

# 3. Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui.html
# API Docs:  http://localhost:8080/api-docs
```

**Note:** First startup may take 3–5 minutes while Maven downloads dependencies and builds the Spring Boot JAR.

### Stopping

```bash
docker-compose down          # Stop containers
docker-compose down -v       # Stop and remove volumes (deletes DB data)
```

---

## Environment Variables

The `.env` file at the project root controls all configuration:

```env
# MySQL
MYSQL_ROOT_PASSWORD=planify_root_pass
MYSQL_DATABASE=planify_db
MYSQL_USER=planify_user
MYSQL_PASSWORD=planify_pass

# JWT
JWT_SECRET=planify_jwt_secret_key_must_be_at_least_256_bits_long_for_hs256_algorithm
JWT_EXPIRATION=86400000       # 24 hours in ms

# URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Test Accounts

All test accounts use password: **`Admin123!`**

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Admin** | `admin@planify.com` | `Admin123!` | Full system access |
| **Chef Département (INFO)** | `head.info@planify.com` | `Admin123!` | Dept. Informatique |
| **Chef Département (MATH)** | `head.math@planify.com` | `Admin123!` | Dept. Mathématiques |
| **Chef Département (PHY)** | `head.phy@planify.com` | `Admin123!` | Dept. Physique |
| **Professeur** | `prof.karim@planify.com` | `Admin123!` | Algorithmique |
| **Professeur** | `prof.leila@planify.com` | `Admin123!` | Réseaux |
| **Professeur** | `prof.hassan@planify.com` | `Admin123!` | Bases de données |
| **Étudiant** | `student.ali@planify.com` | `Admin123!` | Groupe L2-INFO-A |
| **Étudiant** | `student.sara@planify.com` | `Admin123!` | Groupe L2-INFO-A |

---

## API Documentation

After starting the application:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### Key Endpoints

```
# Authentication
POST /api/auth/login              - Login (returns JWT or 2FA flag)
POST /api/auth/2fa/verify         - Complete 2FA login
POST /api/auth/2fa/setup          - Initiate 2FA setup (returns QR URI)
POST /api/auth/2fa/enable         - Enable 2FA with code verification
POST /api/auth/2fa/disable        - Disable 2FA

# Admin
GET  /api/admin/department-heads  - List department heads
POST /api/admin/department-heads  - Create department head
PUT  /api/admin/department-heads/{id} - Update
DELETE /api/admin/department-heads/{id} - Delete

# Resources (Department Head / Admin)
GET|POST|PUT|DELETE /api/professors
GET|POST|PUT|DELETE /api/subjects
GET|POST|PUT|DELETE /api/classrooms
GET|POST|PUT|DELETE /api/groups
GET|POST|PUT|DELETE /api/timeslots

# Timetables
POST /api/schedules/generate      - Run OptaPlanner solver
GET  /api/schedules               - List schedules
GET  /api/schedules/{id}/sessions - View sessions for a schedule
POST /api/schedules/{id}/validate - Validate generated schedule
POST /api/schedules/{id}/publish  - Publish to professors/students
GET  /api/schedules/my-schedule   - Professor's personal schedule
GET  /api/schedules/by-group/{id} - Student group schedule
```

---

## OptaPlanner Design

### Planning Solution
`TimeTable` (`@PlanningSolution`): Contains time slots, classrooms (problem facts), and lessons (planning entities).

### Planning Entity
`Lesson` (`@PlanningEntity`): Represents one class session. OptaPlanner assigns:
- `timeSlot` — when the lesson takes place
- `classroom` — where the lesson takes place

### Hard Constraints (must not be violated)
| ID | Constraint |
|----|-----------|
| IA-C01 | Professor conflict — no two lessons at the same time for one professor |
| IA-C02 | Classroom conflict — no two groups in the same room simultaneously |
| IA-C03 | Professor unavailability — respect availability constraints |
| IA-C04 | Student group conflict — no overlapping lessons for the same group |
| IA-C05 | Room type match — CI→Amphitheater, TD→TD_Room, TP→Laboratory |
| IA-C06 | Classroom capacity — room must fit the student group |

### Soft Constraints (optimized)
| ID | Constraint |
|----|-----------|
| IA-C07 | Balance daily student load — avoid more than 4 lessons/day |
| IA-C08 | Minimize schedule gaps — avoid large time gaps for groups |
| IA-C09 | Professor time preferences — prefer morning slots |
| IA-C10 | Group consecutive lessons — group same-group lessons on same days |

### Solver Configuration
- **Construction Heuristic**: First Fit Decreasing (initial solution)
- **Local Search**: Tabu Search (optimization)
- **Termination**: 30 seconds (configurable via `solveSeconds` in API request)
- **Score**: `HardSoftScore` — negative hard score means infeasible solution

---

## Development (without Docker)

### Backend
```bash
cd backend
# Make sure MySQL is running locally
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

*Planify — Développé par Haydar ABELLAOUI, Wassim KRAIEM, Mohamed Chaker BELHADJ AMOR*  
*Version 1.0 — 2025-2026*
