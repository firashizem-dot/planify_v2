# Planify — University Timetable Management System

A full-stack web application for automated university timetable generation using **OptaPlanner**. Built with Spring Boot (Java 17), Next.js 14 (TypeScript), MySQL 8, and Docker.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Quick Start (Docker)](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Seed Data Overview](#seed-data-overview)
7. [Test Accounts & Credentials](#test-accounts--credentials)
8. [End-to-End Testing Guide](#end-to-end-testing-guide)
9. [API Documentation](#api-documentation)
10. [OptaPlanner Design](#optaplanner-design)

---

## Project Description

Planify automates the creation of university timetables by solving complex scheduling constraints using OptaPlanner (Constraint Programming). It supports:

- **Role-based access**: Admin, Department Head, Professor, Student
- **Automatic timetable generation** with hard/soft constraints (OptaPlanner)
- **2FA authentication** (TOTP / Google Authenticator)
- **Real-time timetable visualization** with interactive grid
- **Resource management**: Professors, Subjects, Classrooms, Student Groups, Time Slots, Students

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
# 1. Navigate to project
cd planify

# 2. Full reset (wipe DB) and rebuild
docker-compose down -v
docker-compose up --build

# Services start in order:
#   mysql   → waits for health check
#   backend → waits for mysql (runs Flyway: V1→V6)
#   frontend → waits for backend

# 3. Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui.html
```

**Note:** First startup may take 3–5 minutes while Maven downloads dependencies.

### Stopping

```bash
docker-compose down          # Stop containers (keeps data)
docker-compose down -v       # Stop and wipe all data (fresh seed on next start)
```

---

## Environment Variables

```env
# MySQL
MYSQL_ROOT_PASSWORD=planify_root_pass
MYSQL_DATABASE=planify_db
MYSQL_USER=planify_user
MYSQL_PASSWORD=planify_pass

# JWT
JWT_SECRET=planify_jwt_secret_key_must_be_at_least_256_bits_long_for_hs256_algorithm
JWT_EXPIRATION=86400000

# URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Seed Data Overview

The database is automatically populated via Flyway migrations on first start:

| Entity | Count | Details |
|--------|-------|---------|
| Departments | 2 | Informatique (INFO), Mathématiques (MATH) |
| Department Heads | 2 | One per department |
| Professors | 18 | 9 per department (3 per level L1/L2/L3) |
| Student Groups | 6 | 3 per department: L1-A, L2-A, L3-A |
| Students | 150 | 25 per group |
| Classrooms | 32 | 16 per dept: 4 AMPH + 8 TD + 4 LAB |
| Subjects | 60 | 10 per semester (S1/S3/S5) per department |
| Time Slots | 50 | 25 per dept: 5 slots × 5 days (Mon–Fri) |

**Subjects by level:**
- `L1` groups → semester `S1` (10 subjects: mix of CI 1.5h, TD 1.5h/3h, TP 1.5h/3h)
- `L2` groups → semester `S3` (10 subjects)
- `L3` groups → semester `S5` (10 subjects)

---

## Test Accounts & Credentials

> **All passwords: `Admin123!`**

### Administrator

| Email | Password | Access |
|-------|----------|--------|
| `admin@planify.com` | `Admin123!` | Full system: manages dept heads, departments, all resources |

### Department Heads

| Email | Password | Department |
|-------|----------|------------|
| `benali.ahmed@planify.com` | `Admin123!` | Informatique (INFO) |
| `zahra.fatima@planify.com` | `Admin123!` | Mathématiques (MATH) |

### Professors — Informatique

| Email | Password | Level | Teaches |
|-------|----------|-------|---------|
| `benammar.karim@planify.com` | `Admin123!` | L1 | Intro Programmation CI/TD/TP |
| `boukhris.leila@planify.com` | `Admin123!` | L1 | Mathématiques Discrètes + Architecture |
| `chaabane.hassan@planify.com` | `Admin123!` | L1 | Systèmes d'Exploitation + Algo |
| `dridi.amira@planify.com` | `Admin123!` | L2 | Algorithmique Avancée CI/TD/TP |
| `essid.nizar@planify.com` | `Admin123!` | L2 | Réseaux Informatiques CI/TD/TP |
| `fakhfakh.sonia@planify.com` | `Admin123!` | L2 | Bases de Données + Génie Logiciel |
| `gharbi.tarek@planify.com` | `Admin123!` | L3 | Intelligence Artificielle CI/TD/TP |
| `hamdi.ines@planify.com` | `Admin123!` | L3 | Sécurité + Cloud Computing |
| `jendoubi.walid@planify.com` | `Admin123!` | L3 | Big Data + Projet de Fin d'Études |

### Professors — Mathématiques

| Email | Password | Level | Teaches |
|-------|----------|-------|---------|
| `karray.fatma@planify.com` | `Admin123!` | L1 | Analyse Mathématique + Algèbre Linéaire |
| `laabidi.ali@planify.com` | `Admin123!` | L1 | Probabilités + Géométrie |
| `mansouri.rania@planify.com` | `Admin123!` | L1 | Informatique de Base |
| `nasri.slim@planify.com` | `Admin123!` | L2 | Analyse Numérique CI/TD/TP |
| `ouali.amel@planify.com` | `Admin123!` | L2 | Statistiques + Optimisation |
| `riahi.mehdi@planify.com` | `Admin123!` | L2 | Équations Différentielles + Calcul Sci. |
| `sfaxi.sirine@planify.com` | `Admin123!` | L3 | Mathématiques Financières + Topologie |
| `trabelsi.youssef@planify.com` | `Admin123!` | L3 | Recherche Opérationnelle + Modélisation |
| `turki.imen@planify.com` | `Admin123!` | L3 | Théorie des Jeux + Mémoire |

### Students — Sample Credentials

Each group has 25 students. Email pattern: `[prefix].[01-25]@planify.tn`

| Group | Level | Sample Emails | Password |
|-------|-------|---------------|----------|
| L1-INFO-A | L1 INFO | `il1.01@planify.tn` … `il1.25@planify.tn` | `Admin123!` |
| L2-INFO-A | L2 INFO | `il2.01@planify.tn` … `il2.25@planify.tn` | `Admin123!` |
| L3-INFO-A | L3 INFO | `il3.01@planify.tn` … `il3.25@planify.tn` | `Admin123!` |
| L1-MATH-A | L1 MATH | `ml1.01@planify.tn` … `ml1.25@planify.tn` | `Admin123!` |
| L2-MATH-A | L2 MATH | `ml2.01@planify.tn` … `ml2.25@planify.tn` | `Admin123!` |
| L3-MATH-A | L3 MATH | `ml3.01@planify.tn` … `ml3.25@planify.tn` | `Admin123!` |

**Specific student examples:**

| Email | Name | Group |
|-------|------|-------|
| `il1.01@planify.tn` | Ali Ben Ali | L1-INFO-A |
| `il1.02@planify.tn` | Sana Trabelsi | L1-INFO-A |
| `il2.01@planify.tn` | Ali Ben Ali | L2-INFO-A |
| `il3.01@planify.tn` | Ali Ben Ali | L3-INFO-A |
| `ml1.01@planify.tn` | Ali Ben Ali | L1-MATH-A |
| `ml2.01@planify.tn` | Ali Ben Ali | L2-MATH-A |
| `ml3.01@planify.tn` | Ali Ben Ali | L3-MATH-A |

---

## End-to-End Testing Guide

### 1. Generate a Timetable (as Department Head)

1. Log in as **`benali.ahmed@planify.com`** / `Admin123!`
2. Go to **Emplois du temps**
3. Click **Nouvelle génération**
4. Set:
   - Semestre: `S1`
   - Niveau: `L1` (to target only the L1-INFO-A group)
   - Année académique: `2025-2026`
   - Durée: `30` seconds
5. Click **Lancer la génération** — wait for OptaPlanner to solve
6. The generated schedule appears in the list with a score
   - `0H` hard score = all constraints satisfied
   - Negative hard score = violated constraints are listed by name
7. Click **Valider** → then **Publier**

### 2. Verify the Professor sees their timetable

1. Log in as **`benammar.karim@planify.com`** / `Admin123!`
   *(This professor teaches Intro Programmation for L1 — they will have sessions in the published schedule)*
2. Go to **Mon EDT**
3. The weekly timetable grid should show their scheduled sessions
4. Sessions only appear once the department head has **published** the schedule

### 3. Verify the Student sees their timetable

1. Log in as **`il1.01@planify.tn`** / `Admin123!`
   *(This student is in group L1-INFO-A)*
2. Go to **Mon EDT**
3. Select group **Groupe L1-INFO-A**
4. The weekly timetable grid should show all sessions for that group
5. Sessions only appear once the department head has **published** the schedule

### 4. Test MATH Department

Repeat steps 1–3 using:
- Head: `zahra.fatima@planify.com` → generate for INFO dept 2, semester S1, level L1
- Professor: `karray.fatma@planify.com` → should see Analyse + Algèbre sessions
- Student: `ml1.01@planify.tn` → select group L1-MATH-A

### 5. Test all levels in one shot

Log in as the dept head and generate **without** specifying a level to schedule all 3 groups (L1, L2, L3) at once for a given semester. Use `S1` to target L1 subjects, `S3` for L2, or `S5` for L3.

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

# Admin
GET|POST|PUT|DELETE /api/admin/department-heads
GET|POST|PUT|DELETE /api/admin/departments

# Resources (Admin + Department Head)
GET|POST|PUT|DELETE /api/professors
GET|POST|PUT|DELETE /api/subjects
GET|POST|PUT|DELETE /api/classrooms
GET|POST|PUT|DELETE /api/groups
GET|POST|PUT|DELETE /api/students
GET|POST|PUT|DELETE /api/timeslots

# Timetables
POST /api/schedules/generate      - Run OptaPlanner solver
GET  /api/schedules               - List schedules
GET  /api/schedules/{id}/sessions - View sessions
POST /api/schedules/{id}/validate - Validate
POST /api/schedules/{id}/publish  - Publish (visible to professors/students)
GET  /api/schedules/my-schedule   - Professor's personal schedule (JWT)
GET  /api/schedules/by-group/{id} - Student group schedule (published only)
```

---

## OptaPlanner Design

### Hard Constraints (must not be violated)
| Constraint | Description |
|-----------|-------------|
| Professor conflict | No professor in two places at once |
| Classroom conflict | No two groups in the same room simultaneously |
| Student group conflict | No overlapping lessons for the same group |
| Professor unavailability | Respect blocked time slots |
| Classroom type mismatch | CI→Amphitheater, TD→TD_Room, TP→Laboratory |
| Classroom capacity | Room must fit the student group (25 students) |

### Soft Constraints (optimized)
| Constraint | Description |
|-----------|-------------|
| Spread group lessons across days | Avoid clustering all lessons on one day |
| Daily lesson limit per group | Max ~3 lessons/day per group |
| Professor slot preferences | Avoid timeslots the professor marked as unwanted |
| Minimize schedule gaps | Avoid large time gaps between sessions for a group |

### Solver Configuration
- **Termination**: 30 seconds by default (configurable via `solveSeconds`)
- **Score**: `HardSoftScore` — negative hard score = infeasible, violated constraints listed by name in the UI

---

*Planify — Développé par Haydar ABELLAOUI, Wassim KRAIEM, Mohamed Chaker BELHADJ AMOR*
*Version 1.0 — 2025-2026*
