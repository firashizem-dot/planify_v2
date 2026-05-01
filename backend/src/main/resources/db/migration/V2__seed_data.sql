-- =====================================================
-- Planify Seed Data - V2
-- Default accounts and sample data
-- Passwords hashed with BCrypt (cost factor 10)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (id, name, code, description) VALUES
(1, 'Informatique', 'INFO', 'Département d''Informatique et Nouvelles Technologies'),
(2, 'Mathématiques', 'MATH', 'Département de Mathématiques Appliquées'),
(3, 'Physique', 'PHY', 'Département de Physique et Sciences Naturelles');

-- =====================================================
-- USERS (All passwords = "Admin123!" hashed with BCrypt)
-- BCrypt hash of "Admin123!" : $2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy
-- BCrypt hash of "Head123!"  : $2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy
-- BCrypt hash of "Prof123!"  : $2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy
-- =====================================================

-- Admin account
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(1, 'admin@planify.com', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'System', 'Admin', 'ADMIN', NULL, TRUE);

-- Department Heads
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(2, 'head.info@planify.com', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed', 'Ben Ali', 'DEPARTMENT_HEAD', 1, TRUE),
(3, 'head.math@planify.com', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatima', 'Zahra', 'DEPARTMENT_HEAD', 2, TRUE),
(4, 'head.phy@planify.com', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Karray', 'DEPARTMENT_HEAD', 3, TRUE);

-- Professors
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(5,  'prof.karim@planify.com',   '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Karim',   'Trabelsi', 'PROFESSOR', 1, TRUE),
(6,  'prof.leila@planify.com',   '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Leila',   'Mansour',  'PROFESSOR', 1, TRUE),
(7,  'prof.hassan@planify.com',  '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hassan',  'Belhaj',   'PROFESSOR', 1, TRUE),
(8,  'prof.amira@planify.com',   '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amira',   'Gharbi',   'PROFESSOR', 2, TRUE),
(9,  'prof.nizar@planify.com',   '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Hamdi',    'PROFESSOR', 2, TRUE);

-- Students
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(10, 'student.ali@planify.com',  '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Chahed',   'STUDENT', 1, TRUE),
(11, 'student.sara@planify.com', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sara',    'Dridi',    'STUDENT', 1, TRUE);

-- Update department heads
UPDATE departments SET head_id = 2 WHERE id = 1;
UPDATE departments SET head_id = 3 WHERE id = 2;
UPDATE departments SET head_id = 4 WHERE id = 3;

-- =====================================================
-- PROFESSORS (linked to user accounts)
-- =====================================================
INSERT INTO professors (id, user_id, department_id, specialization, max_hours_per_week) VALUES
(1, 5, 1, 'Algorithmes et Structures de Données', 18),
(2, 6, 1, 'Réseaux et Systèmes Distribués',       18),
(3, 7, 1, 'Intelligence Artificielle',              16),
(4, 8, 2, 'Algèbre Linéaire',                      18),
(5, 9, 2, 'Analyse Mathématique',                  18);

-- =====================================================
-- CLASSROOMS
-- =====================================================
INSERT INTO classrooms (id, name, code, type, capacity, department_id, equipment) VALUES
-- Amphitheaters
(1,  'Amphithéâtre A', 'AMPH-A', 'AMPHITHEATER', 200, NULL, 'Projecteur, Microphone, Climatiseur'),
(2,  'Amphithéâtre B', 'AMPH-B', 'AMPHITHEATER', 150, NULL, 'Projecteur, Microphone'),
-- TD Rooms
(3,  'Salle TD 101', 'TD-101', 'TD_ROOM', 35, 1, 'Tableau, Projecteur'),
(4,  'Salle TD 102', 'TD-102', 'TD_ROOM', 35, 1, 'Tableau, Projecteur'),
(5,  'Salle TD 201', 'TD-201', 'TD_ROOM', 30, 2, 'Tableau'),
(6,  'Salle TD 202', 'TD-202', 'TD_ROOM', 30, 2, 'Tableau'),
-- Laboratories
(7,  'Labo Informatique 1', 'LAB-INFO-1', 'LABORATORY', 25, 1, '25 PC, Réseau, Serveur'),
(8,  'Labo Informatique 2', 'LAB-INFO-2', 'LABORATORY', 25, 1, '25 PC, Réseau'),
(9,  'Labo Réseaux',        'LAB-NET',   'LABORATORY', 20, 1, '20 PC, Équipements Cisco');

-- =====================================================
-- SUBJECTS (Informatique Department)
-- =====================================================
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(1,  'Algorithmique Avancée',      'INFO-ALG-CI',  1, 'CI', 1.5, 'L2', 'Cours magistral d''algorithmique avancée'),
(2,  'Algorithmique Avancée TD',   'INFO-ALG-TD',  1, 'TD', 1.5, 'L2', 'Travaux dirigés d''algorithmique'),
(3,  'Algorithmique Avancée TP',   'INFO-ALG-TP',  1, 'TP', 1.5, 'L2', 'Travaux pratiques d''algorithmique'),
(4,  'Réseaux Informatiques CI',   'INFO-NET-CI',  1, 'CI', 1.5, 'L2', 'Cours magistral de réseaux'),
(5,  'Réseaux Informatiques TD',   'INFO-NET-TD',  1, 'TD', 1.5, 'L2', 'Travaux dirigés de réseaux'),
(6,  'Réseaux Informatiques TP',   'INFO-NET-TP',  1, 'TP', 1.5, 'L2', 'Travaux pratiques de réseaux'),
(7,  'Bases de Données CI',        'INFO-BD-CI',   1, 'CI', 1.5, 'L2', 'Cours magistral de bases de données'),
(8,  'Bases de Données TD',        'INFO-BD-TD',   1, 'TD', 1.5, 'L2', 'Travaux dirigés BD'),
(9,  'Bases de Données TP',        'INFO-BD-TP',   1, 'TP', 1.5, 'L2', 'Travaux pratiques BD');

-- =====================================================
-- STUDENT GROUPS
-- =====================================================
INSERT INTO student_groups (id, name, code, department_id, level, student_count) VALUES
(1, 'Groupe L2-INFO-A', 'L2-INFO-A', 1, 'L2', 30),
(2, 'Groupe L2-INFO-B', 'L2-INFO-B', 1, 'L2', 28),
(3, 'Groupe L3-INFO-A', 'L3-INFO-A', 1, 'L3', 25),
(4, 'Groupe L2-MATH-A', 'L2-MATH-A', 2, 'L2', 35);

-- =====================================================
-- TIME SLOTS (Department Informatique)
-- Standard schedule: Mon-Fri, 3 slots per day
-- =====================================================
INSERT INTO time_slots (id, day_of_week, start_time, end_time, department_id) VALUES
-- Monday
(1,  'MONDAY',    '08:00:00', '09:30:00', 1),
(2,  'MONDAY',    '09:45:00', '11:15:00', 1),
(3,  'MONDAY',    '11:30:00', '13:00:00', 1),
(4,  'MONDAY',    '14:00:00', '15:30:00', 1),
(5,  'MONDAY',    '15:45:00', '17:15:00', 1),
-- Tuesday
(6,  'TUESDAY',   '08:00:00', '09:30:00', 1),
(7,  'TUESDAY',   '09:45:00', '11:15:00', 1),
(8,  'TUESDAY',   '11:30:00', '13:00:00', 1),
(9,  'TUESDAY',   '14:00:00', '15:30:00', 1),
(10, 'TUESDAY',   '15:45:00', '17:15:00', 1),
-- Wednesday
(11, 'WEDNESDAY', '08:00:00', '09:30:00', 1),
(12, 'WEDNESDAY', '09:45:00', '11:15:00', 1),
(13, 'WEDNESDAY', '11:30:00', '13:00:00', 1),
(14, 'WEDNESDAY', '14:00:00', '15:30:00', 1),
(15, 'WEDNESDAY', '15:45:00', '17:15:00', 1),
-- Thursday
(16, 'THURSDAY',  '08:00:00', '09:30:00', 1),
(17, 'THURSDAY',  '09:45:00', '11:15:00', 1),
(18, 'THURSDAY',  '11:30:00', '13:00:00', 1),
(19, 'THURSDAY',  '14:00:00', '15:30:00', 1),
(20, 'THURSDAY',  '15:45:00', '17:15:00', 1),
-- Friday
(21, 'FRIDAY',    '08:00:00', '09:30:00', 1),
(22, 'FRIDAY',    '09:45:00', '11:15:00', 1),
(23, 'FRIDAY',    '11:30:00', '13:00:00', 1),
(24, 'FRIDAY',    '14:00:00', '15:30:00', 1),
(25, 'FRIDAY',    '15:45:00', '17:15:00', 1);

-- =====================================================
-- PROFESSOR SUBJECTS (assignments)
-- =====================================================
INSERT INTO professor_subjects (professor_id, subject_id) VALUES
(1, 1), (1, 2), (1, 3),  -- Prof Karim: Algorithmique
(2, 4), (2, 5), (2, 6),  -- Prof Leila: Réseaux
(3, 7), (3, 8), (3, 9);  -- Prof Hassan: Bases de Données

SET FOREIGN_KEY_CHECKS = 1;
