-- =====================================================
-- Planify Database Schema - V1
-- University Timetable Management System
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    first_name  VARCHAR(100)    NOT NULL,
    last_name   VARCHAR(100)    NOT NULL,
    role        ENUM('ADMIN', 'DEPARTMENT_HEAD', 'PROFESSOR', 'STUDENT') NOT NULL,
    enabled     BOOLEAN         NOT NULL DEFAULT TRUE,
    two_factor_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret   VARCHAR(255),
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL UNIQUE,
    code        VARCHAR(50)     NOT NULL UNIQUE,
    description TEXT,
    head_id     BIGINT,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_departments_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add department_id to users after departments table is created
ALTER TABLE users ADD COLUMN department_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_users_department
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Add foreign key for department head
ALTER TABLE departments ADD CONSTRAINT fk_departments_head
    FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL;

-- =====================================================
-- PROFESSORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS professors (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    user_id             BIGINT          NOT NULL UNIQUE,
    department_id       BIGINT          NOT NULL,
    specialization      VARCHAR(255),
    max_hours_per_week  INT             NOT NULL DEFAULT 18,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_professors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_professors_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_professors_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUBJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255)    NOT NULL,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    department_id   BIGINT          NOT NULL,
    course_type     ENUM('CI', 'TD', 'TP') NOT NULL,
    hours_per_week  DECIMAL(4, 1)   NOT NULL,
    level           VARCHAR(100),
    description     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_subjects_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_subjects_department (department_id),
    INDEX idx_subjects_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CLASSROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS classrooms (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    type            ENUM('AMPHITHEATER', 'TD_ROOM', 'LABORATORY') NOT NULL,
    capacity        INT             NOT NULL,
    department_id   BIGINT,
    equipment       TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_classrooms_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_classrooms_type (type),
    INDEX idx_classrooms_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STUDENT GROUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS student_groups (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    department_id   BIGINT          NOT NULL,
    level           VARCHAR(100),
    student_count   INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_student_groups_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_student_groups_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TIME SLOTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS time_slots (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    day_of_week     ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') NOT NULL,
    start_time      TIME        NOT NULL,
    end_time        TIME        NOT NULL,
    department_id   BIGINT      NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_time_slot (day_of_week, start_time, end_time, department_id),
    CONSTRAINT fk_time_slots_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_time_slots_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROFESSOR AVAILABILITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS professor_availabilities (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    professor_id    BIGINT      NOT NULL,
    time_slot_id    BIGINT      NOT NULL,
    available       BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uk_professor_timeslot (professor_id, time_slot_id),
    CONSTRAINT fk_availability_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
    CONSTRAINT fk_availability_timeslot FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROFESSOR SUBJECTS (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS professor_subjects (
    professor_id    BIGINT  NOT NULL,
    subject_id      BIGINT  NOT NULL,
    PRIMARY KEY (professor_id, subject_id),
    CONSTRAINT fk_ps_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
    CONSTRAINT fk_ps_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS schedules (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    department_id   BIGINT          NOT NULL,
    semester        VARCHAR(100)    NOT NULL,
    academic_year   VARCHAR(20)     NOT NULL,
    status          ENUM('DRAFT','GENERATED','VALIDATED','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    hard_score      INT             NOT NULL DEFAULT 0,
    soft_score      INT             NOT NULL DEFAULT 0,
    solve_duration_ms BIGINT,
    created_by_id   BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_schedules_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_schedules_created_by FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_schedules_department (department_id),
    INDEX idx_schedules_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SCHEDULE SESSIONS TABLE (Individual Lessons)
-- =====================================================
CREATE TABLE IF NOT EXISTS schedule_sessions (
    id                  BIGINT  NOT NULL AUTO_INCREMENT,
    schedule_id         BIGINT  NOT NULL,
    subject_id          BIGINT  NOT NULL,
    professor_id        BIGINT  NOT NULL,
    classroom_id        BIGINT  NOT NULL,
    student_group_id    BIGINT  NOT NULL,
    time_slot_id        BIGINT  NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_sessions_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sessions_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sessions_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sessions_group FOREIGN KEY (student_group_id) REFERENCES student_groups(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sessions_timeslot FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE RESTRICT,
    INDEX idx_sessions_schedule (schedule_id),
    INDEX idx_sessions_professor (professor_id),
    INDEX idx_sessions_group (student_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
