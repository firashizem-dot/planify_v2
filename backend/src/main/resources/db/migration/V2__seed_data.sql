-- =====================================================
-- Planify Seed Data - V2 (Comprehensive)
-- 2 Departments · 2 Dept Heads · 18 Professors
-- 6 Groups (3/dept) · 32 Classrooms · 60 Subjects
-- 50 Time Slots · 150 Students (25/group)
--
-- ALL passwords = "Admin123!"
-- BCrypt(10): $2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- DEPARTMENTS (2)
-- =====================================================
INSERT INTO departments (id, name, code, description) VALUES
(1, 'Informatique',  'INFO', 'Département d''Informatique et Nouvelles Technologies'),
(2, 'Mathématiques', 'MATH', 'Département de Mathématiques Appliquées');

-- =====================================================
-- USERS  (admin + 2 heads + 18 profs + 150 students = 171)
-- =====================================================

-- Admin
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(1, 'admin@planify.com',
 '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
 'System', 'Admin', 'ADMIN', NULL, TRUE);

-- Department Heads
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(2, 'benali.ahmed@planify.com',
 '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
 'Ahmed', 'Ben Ali', 'DEPARTMENT_HEAD', 1, TRUE),
(3, 'zahra.fatima@planify.com',
 '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
 'Fatima', 'Zahra', 'DEPARTMENT_HEAD', 2, TRUE);

-- INFO Professors (users 4-12, professor IDs 1-9)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(4,  'benammar.karim@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Karim',  'Ben Ammar',  'PROFESSOR', 1, TRUE),
(5,  'boukhris.leila@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Leila',  'Boukhris',   'PROFESSOR', 1, TRUE),
(6,  'chaabane.hassan@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Hassan', 'Chaabane',   'PROFESSOR', 1, TRUE),
(7,  'dridi.amira@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Amira',  'Dridi',      'PROFESSOR', 1, TRUE),
(8,  'essid.nizar@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Nizar',  'Essid',      'PROFESSOR', 1, TRUE),
(9,  'fakhfakh.sonia@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Sonia',  'Fakhfakh',   'PROFESSOR', 1, TRUE),
(10, 'gharbi.tarek@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Tarek',  'Gharbi',     'PROFESSOR', 1, TRUE),
(11, 'hamdi.ines@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Ines',   'Hamdi',      'PROFESSOR', 1, TRUE),
(12, 'jendoubi.walid@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Walid',  'Jendoubi',   'PROFESSOR', 1, TRUE);

-- MATH Professors (users 13-21, professor IDs 10-18)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(13, 'karray.fatma@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Fatma',  'Karray',     'PROFESSOR', 2, TRUE),
(14, 'laabidi.ali@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Ali',    'Laabidi',    'PROFESSOR', 2, TRUE),
(15, 'mansouri.rania@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Rania',  'Mansouri',   'PROFESSOR', 2, TRUE),
(16, 'nasri.slim@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Slim',   'Nasri',      'PROFESSOR', 2, TRUE),
(17, 'ouali.amel@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Amel',   'Ouali',      'PROFESSOR', 2, TRUE),
(18, 'riahi.mehdi@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Mehdi',  'Riahi',      'PROFESSOR', 2, TRUE),
(19, 'sfaxi.sirine@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Sirine', 'Sfaxi',      'PROFESSOR', 2, TRUE),
(20, 'trabelsi.youssef@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Youssef','Trabelsi',   'PROFESSOR', 2, TRUE),
(21, 'turki.imen@planify.com',
     '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy',
     'Imen',   'Turki',      'PROFESSOR', 2, TRUE);

-- INFO L1 Students (users 22-46, group 1)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(22, 'il1.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 1, TRUE),
(23, 'il1.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 1, TRUE),
(24, 'il1.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 1, TRUE),
(25, 'il1.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 1, TRUE),
(26, 'il1.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 1, TRUE),
(27, 'il1.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 1, TRUE),
(28, 'il1.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 1, TRUE),
(29, 'il1.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 1, TRUE),
(30, 'il1.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 1, TRUE),
(31, 'il1.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 1, TRUE),
(32, 'il1.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 1, TRUE),
(33, 'il1.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 1, TRUE),
(34, 'il1.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 1, TRUE),
(35, 'il1.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 1, TRUE),
(36, 'il1.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 1, TRUE),
(37, 'il1.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 1, TRUE),
(38, 'il1.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 1, TRUE),
(39, 'il1.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 1, TRUE),
(40, 'il1.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 1, TRUE),
(41, 'il1.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 1, TRUE),
(42, 'il1.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 1, TRUE),
(43, 'il1.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 1, TRUE),
(44, 'il1.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 1, TRUE),
(45, 'il1.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 1, TRUE),
(46, 'il1.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 1, TRUE);

-- INFO L2 Students (users 47-71, group 2)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(47, 'il2.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 1, TRUE),
(48, 'il2.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 1, TRUE),
(49, 'il2.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 1, TRUE),
(50, 'il2.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 1, TRUE),
(51, 'il2.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 1, TRUE),
(52, 'il2.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 1, TRUE),
(53, 'il2.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 1, TRUE),
(54, 'il2.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 1, TRUE),
(55, 'il2.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 1, TRUE),
(56, 'il2.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 1, TRUE),
(57, 'il2.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 1, TRUE),
(58, 'il2.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 1, TRUE),
(59, 'il2.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 1, TRUE),
(60, 'il2.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 1, TRUE),
(61, 'il2.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 1, TRUE),
(62, 'il2.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 1, TRUE),
(63, 'il2.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 1, TRUE),
(64, 'il2.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 1, TRUE),
(65, 'il2.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 1, TRUE),
(66, 'il2.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 1, TRUE),
(67, 'il2.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 1, TRUE),
(68, 'il2.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 1, TRUE),
(69, 'il2.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 1, TRUE),
(70, 'il2.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 1, TRUE),
(71, 'il2.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 1, TRUE);

-- INFO L3 Students (users 72-96, group 3)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(72, 'il3.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 1, TRUE),
(73, 'il3.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 1, TRUE),
(74, 'il3.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 1, TRUE),
(75, 'il3.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 1, TRUE),
(76, 'il3.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 1, TRUE),
(77, 'il3.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 1, TRUE),
(78, 'il3.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 1, TRUE),
(79, 'il3.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 1, TRUE),
(80, 'il3.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 1, TRUE),
(81, 'il3.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 1, TRUE),
(82, 'il3.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 1, TRUE),
(83, 'il3.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 1, TRUE),
(84, 'il3.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 1, TRUE),
(85, 'il3.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 1, TRUE),
(86, 'il3.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 1, TRUE),
(87, 'il3.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 1, TRUE),
(88, 'il3.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 1, TRUE),
(89, 'il3.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 1, TRUE),
(90, 'il3.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 1, TRUE),
(91, 'il3.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 1, TRUE),
(92, 'il3.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 1, TRUE),
(93, 'il3.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 1, TRUE),
(94, 'il3.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 1, TRUE),
(95, 'il3.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 1, TRUE),
(96, 'il3.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 1, TRUE);

-- MATH L1 Students (users 97-121, group 4)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(97,  'ml1.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 2, TRUE),
(98,  'ml1.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 2, TRUE),
(99,  'ml1.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 2, TRUE),
(100, 'ml1.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 2, TRUE),
(101, 'ml1.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 2, TRUE),
(102, 'ml1.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 2, TRUE),
(103, 'ml1.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 2, TRUE),
(104, 'ml1.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 2, TRUE),
(105, 'ml1.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 2, TRUE),
(106, 'ml1.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 2, TRUE),
(107, 'ml1.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 2, TRUE),
(108, 'ml1.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 2, TRUE),
(109, 'ml1.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 2, TRUE),
(110, 'ml1.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 2, TRUE),
(111, 'ml1.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 2, TRUE),
(112, 'ml1.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 2, TRUE),
(113, 'ml1.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 2, TRUE),
(114, 'ml1.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 2, TRUE),
(115, 'ml1.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 2, TRUE),
(116, 'ml1.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 2, TRUE),
(117, 'ml1.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 2, TRUE),
(118, 'ml1.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 2, TRUE),
(119, 'ml1.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 2, TRUE),
(120, 'ml1.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 2, TRUE),
(121, 'ml1.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 2, TRUE);

-- MATH L2 Students (users 122-146, group 5)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(122, 'ml2.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 2, TRUE),
(123, 'ml2.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 2, TRUE),
(124, 'ml2.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 2, TRUE),
(125, 'ml2.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 2, TRUE),
(126, 'ml2.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 2, TRUE),
(127, 'ml2.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 2, TRUE),
(128, 'ml2.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 2, TRUE),
(129, 'ml2.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 2, TRUE),
(130, 'ml2.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 2, TRUE),
(131, 'ml2.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 2, TRUE),
(132, 'ml2.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 2, TRUE),
(133, 'ml2.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 2, TRUE),
(134, 'ml2.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 2, TRUE),
(135, 'ml2.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 2, TRUE),
(136, 'ml2.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 2, TRUE),
(137, 'ml2.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 2, TRUE),
(138, 'ml2.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 2, TRUE),
(139, 'ml2.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 2, TRUE),
(140, 'ml2.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 2, TRUE),
(141, 'ml2.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 2, TRUE),
(142, 'ml2.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 2, TRUE),
(143, 'ml2.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 2, TRUE),
(144, 'ml2.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 2, TRUE),
(145, 'ml2.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 2, TRUE),
(146, 'ml2.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 2, TRUE);

-- MATH L3 Students (users 147-171, group 6)
INSERT INTO users (id, email, password, first_name, last_name, role, department_id, enabled) VALUES
(147, 'ml3.01@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ali',     'Ben Ali',    'STUDENT', 2, TRUE),
(148, 'ml3.02@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sana',    'Trabelsi',   'STUDENT', 2, TRUE),
(149, 'ml3.03@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mohamed', 'Gharbi',     'STUDENT', 2, TRUE),
(150, 'ml3.04@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rania',   'Hamdi',      'STUDENT', 2, TRUE),
(151, 'ml3.05@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Youssef', 'Karray',     'STUDENT', 2, TRUE),
(152, 'ml3.06@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Imen',    'Belhadj',    'STUDENT', 2, TRUE),
(153, 'ml3.07@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Khalil',  'Riahi',      'STUDENT', 2, TRUE),
(154, 'ml3.08@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Mariem',  'Tlili',      'STUDENT', 2, TRUE),
(155, 'ml3.09@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ahmed',   'Mansour',    'STUDENT', 2, TRUE),
(156, 'ml3.10@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sirine',  'Chahed',     'STUDENT', 2, TRUE),
(157, 'ml3.11@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nizar',   'Dridi',      'STUDENT', 2, TRUE),
(158, 'ml3.12@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lina',    'Jendoubi',   'STUDENT', 2, TRUE),
(159, 'ml3.13@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Sami',    'Boukadi',    'STUDENT', 2, TRUE),
(160, 'ml3.14@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Fatma',   'Makni',      'STUDENT', 2, TRUE),
(161, 'ml3.15@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Hadi',    'Selmi',      'STUDENT', 2, TRUE),
(162, 'ml3.16@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amel',    'Nasri',      'STUDENT', 2, TRUE),
(163, 'ml3.17@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Slim',    'Besbes',     'STUDENT', 2, TRUE),
(164, 'ml3.18@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Houda',   'Rhouma',     'STUDENT', 2, TRUE),
(165, 'ml3.19@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Rami',    'Boughanmi',  'STUDENT', 2, TRUE),
(166, 'ml3.20@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Ines',    'Fakhfakh',   'STUDENT', 2, TRUE),
(167, 'ml3.21@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Bassem',  'Elloumi',    'STUDENT', 2, TRUE),
(168, 'ml3.22@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Lamia',   'Turki',      'STUDENT', 2, TRUE),
(169, 'ml3.23@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Tarek',   'Sfaxi',      'STUDENT', 2, TRUE),
(170, 'ml3.24@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Nesrine', 'Ayedi',      'STUDENT', 2, TRUE),
(171, 'ml3.25@planify.tn', '$2a$10$C4As2Ujn.wTNJqQPiYTvz.mQOmvzxeaUJCud5xaFmRWVnKW1LuJvy', 'Amine',   'Borsali',    'STUDENT', 2, TRUE);

-- =====================================================
-- ASSIGN DEPARTMENT HEADS
-- =====================================================
UPDATE departments SET head_id = 2 WHERE id = 1;
UPDATE departments SET head_id = 3 WHERE id = 2;

-- =====================================================
-- PROFESSORS (18 total: 9 INFO + 9 MATH)
-- =====================================================
INSERT INTO professors (id, user_id, department_id, specialization, max_hours_per_week) VALUES
-- INFO L1
(1,  4,  1, 'Programmation et Algorithmique',         18),
(2,  5,  1, 'Mathématiques Discrètes et Architecture',18),
(3,  6,  1, 'Systèmes d''Exploitation',               16),
-- INFO L2
(4,  7,  1, 'Algorithmique Avancée',                  18),
(5,  8,  1, 'Réseaux et Télécommunications',          18),
(6,  9,  1, 'Bases de Données et Génie Logiciel',     18),
-- INFO L3
(7,  10, 1, 'Intelligence Artificielle',              18),
(8,  11, 1, 'Cybersécurité et Cloud Computing',       16),
(9,  12, 1, 'Big Data et Analyse de Données',         18),
-- MATH L1
(10, 13, 2, 'Analyse Mathématique et Algèbre Linéaire',18),
(11, 14, 2, 'Probabilités et Géométrie',              18),
(12, 15, 2, 'Informatique Mathématique',              16),
-- MATH L2
(13, 16, 2, 'Analyse Numérique',                     18),
(14, 17, 2, 'Statistiques et Optimisation',           18),
(15, 18, 2, 'Équations Différentielles et Calcul',    18),
-- MATH L3
(16, 19, 2, 'Mathématiques Financières et Topologie', 18),
(17, 20, 2, 'Recherche Opérationnelle et Modélisation',18),
(18, 21, 2, 'Théorie des Jeux',                       16);

-- =====================================================
-- CLASSROOMS (32 total: 16 INFO + 16 MATH)
-- 4 AMPH + 8 TD + 4 LAB per department
-- =====================================================
INSERT INTO classrooms (id, name, code, type, capacity, department_id, equipment) VALUES
-- INFO Amphitheaters (capacity 200)
(1,  'Amphithéâtre INFO 1', 'AMPH-I-1', 'AMPHITHEATER', 200, 1, 'Projecteur, Microphone, Climatiseur'),
(2,  'Amphithéâtre INFO 2', 'AMPH-I-2', 'AMPHITHEATER', 200, 1, 'Projecteur, Microphone, Climatiseur'),
(3,  'Amphithéâtre INFO 3', 'AMPH-I-3', 'AMPHITHEATER', 150, 1, 'Projecteur, Microphone'),
(4,  'Amphithéâtre INFO 4', 'AMPH-I-4', 'AMPHITHEATER', 150, 1, 'Projecteur, Microphone'),
-- INFO TD Rooms (capacity 30)
(5,  'Salle TD INFO 101', 'TD-I-101', 'TD_ROOM', 30, 1, 'Tableau, Projecteur'),
(6,  'Salle TD INFO 102', 'TD-I-102', 'TD_ROOM', 30, 1, 'Tableau, Projecteur'),
(7,  'Salle TD INFO 103', 'TD-I-103', 'TD_ROOM', 30, 1, 'Tableau, Projecteur'),
(8,  'Salle TD INFO 104', 'TD-I-104', 'TD_ROOM', 30, 1, 'Tableau'),
(9,  'Salle TD INFO 201', 'TD-I-201', 'TD_ROOM', 30, 1, 'Tableau, Projecteur'),
(10, 'Salle TD INFO 202', 'TD-I-202', 'TD_ROOM', 30, 1, 'Tableau, Projecteur'),
(11, 'Salle TD INFO 203', 'TD-I-203', 'TD_ROOM', 30, 1, 'Tableau'),
(12, 'Salle TD INFO 204', 'TD-I-204', 'TD_ROOM', 30, 1, 'Tableau'),
-- INFO Laboratories (capacity 25)
(13, 'Labo Informatique 1', 'LAB-I-1', 'LABORATORY', 25, 1, '25 PC, Réseau local, Serveur'),
(14, 'Labo Informatique 2', 'LAB-I-2', 'LABORATORY', 25, 1, '25 PC, Réseau local'),
(15, 'Labo Réseaux',        'LAB-I-3', 'LABORATORY', 25, 1, '25 PC, Cisco, Switches'),
(16, 'Labo Systèmes',       'LAB-I-4', 'LABORATORY', 25, 1, '25 PC, Linux, VMs'),
-- MATH Amphitheaters (capacity 200)
(17, 'Amphithéâtre MATH 1', 'AMPH-M-1', 'AMPHITHEATER', 200, 2, 'Projecteur, Microphone, Climatiseur'),
(18, 'Amphithéâtre MATH 2', 'AMPH-M-2', 'AMPHITHEATER', 200, 2, 'Projecteur, Microphone, Climatiseur'),
(19, 'Amphithéâtre MATH 3', 'AMPH-M-3', 'AMPHITHEATER', 150, 2, 'Projecteur, Microphone'),
(20, 'Amphithéâtre MATH 4', 'AMPH-M-4', 'AMPHITHEATER', 150, 2, 'Projecteur, Microphone'),
-- MATH TD Rooms (capacity 30)
(21, 'Salle TD MATH 101', 'TD-M-101', 'TD_ROOM', 30, 2, 'Tableau, Projecteur'),
(22, 'Salle TD MATH 102', 'TD-M-102', 'TD_ROOM', 30, 2, 'Tableau, Projecteur'),
(23, 'Salle TD MATH 103', 'TD-M-103', 'TD_ROOM', 30, 2, 'Tableau, Projecteur'),
(24, 'Salle TD MATH 104', 'TD-M-104', 'TD_ROOM', 30, 2, 'Tableau'),
(25, 'Salle TD MATH 201', 'TD-M-201', 'TD_ROOM', 30, 2, 'Tableau, Projecteur'),
(26, 'Salle TD MATH 202', 'TD-M-202', 'TD_ROOM', 30, 2, 'Tableau, Projecteur'),
(27, 'Salle TD MATH 203', 'TD-M-203', 'TD_ROOM', 30, 2, 'Tableau'),
(28, 'Salle TD MATH 204', 'TD-M-204', 'TD_ROOM', 30, 2, 'Tableau'),
-- MATH Laboratories (capacity 25)
(29, 'Labo Calcul Scientifique 1', 'LAB-M-1', 'LABORATORY', 25, 2, '25 PC, MATLAB, Python'),
(30, 'Labo Calcul Scientifique 2', 'LAB-M-2', 'LABORATORY', 25, 2, '25 PC, MATLAB, R'),
(31, 'Labo Statistiques',          'LAB-M-3', 'LABORATORY', 25, 2, '25 PC, SPSS, R, Python'),
(32, 'Labo Simulation',            'LAB-M-4', 'LABORATORY', 25, 2, '25 PC, Logiciels simulation');

-- =====================================================
-- STUDENT GROUPS (6: 3 per department)
-- student_count=25 matches the 25 students inserted in V5
-- =====================================================
INSERT INTO student_groups (id, name, code, department_id, level, student_count) VALUES
(1, 'Groupe L1-INFO-A', 'L1-INFO-A', 1, 'L1', 25),
(2, 'Groupe L2-INFO-A', 'L2-INFO-A', 1, 'L2', 25),
(3, 'Groupe L3-INFO-A', 'L3-INFO-A', 1, 'L3', 25),
(4, 'Groupe L1-MATH-A', 'L1-MATH-A', 2, 'L1', 25),
(5, 'Groupe L2-MATH-A', 'L2-MATH-A', 2, 'L2', 25),
(6, 'Groupe L3-MATH-A', 'L3-MATH-A', 2, 'L3', 25);

-- =====================================================
-- SUBJECTS (60 total: 10/level × 3 levels × 2 depts)
-- Note: 'semester' column added in V4; values set in V6
-- =====================================================

-- INFO L1 subjects (IDs 1-10)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(1,  'Intro à la Programmation',     'INFO-L1-PROG-CI',  1, 'CI', 1.5, 'L1', 'Cours magistral introduction à la programmation'),
(2,  'Intro à la Programmation TD',  'INFO-L1-PROG-TD',  1, 'TD', 1.5, 'L1', 'Travaux dirigés programmation'),
(3,  'Intro à la Programmation TP',  'INFO-L1-PROG-TP',  1, 'TP', 1.5, 'L1', 'Travaux pratiques programmation'),
(4,  'Mathématiques Discrètes',      'INFO-L1-MDIS-CI',  1, 'CI', 1.5, 'L1', 'Cours de mathématiques discrètes'),
(5,  'Mathématiques Discrètes TD',   'INFO-L1-MDIS-TD',  1, 'TD', 1.5, 'L1', 'Travaux dirigés mathématiques discrètes'),
(6,  'Architecture des Ordinateurs', 'INFO-L1-ARCH-CI',  1, 'CI', 1.5, 'L1', 'Cours architecture des ordinateurs'),
(7,  'Architecture des Ordinateurs TD','INFO-L1-ARCH-TD', 1, 'TD', 1.5, 'L1', 'Travaux dirigés architecture'),
(8,  'Systèmes d''Exploitation',     'INFO-L1-SYS-CI',   1, 'CI', 3.0, 'L1', 'Cours systèmes d''exploitation (3h)'),
(9,  'Logique Formelle TD',          'INFO-L1-LOG-TD',   1, 'TD', 1.5, 'L1', 'Travaux dirigés logique formelle'),
(10, 'Initiation aux TP Info',       'INFO-L1-INIT-TP',  1, 'TP', 3.0, 'L1', 'Initiation pratique informatique (3h)');

-- INFO L2 subjects (IDs 11-20)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(11, 'Algorithmique Avancée',        'INFO-L2-ALG-CI',    1, 'CI', 1.5, 'L2', 'Cours algorithmique avancée'),
(12, 'Algorithmique Avancée TD',     'INFO-L2-ALG-TD',    1, 'TD', 1.5, 'L2', 'Travaux dirigés algorithmique'),
(13, 'Algorithmique Avancée TP',     'INFO-L2-ALG-TP',    1, 'TP', 1.5, 'L2', 'Travaux pratiques algorithmique'),
(14, 'Réseaux Informatiques',        'INFO-L2-RESEAU-CI', 1, 'CI', 1.5, 'L2', 'Cours réseaux informatiques'),
(15, 'Réseaux Informatiques TD',     'INFO-L2-RESEAU-TD', 1, 'TD', 1.5, 'L2', 'Travaux dirigés réseaux'),
(16, 'Réseaux Informatiques TP',     'INFO-L2-RESEAU-TP', 1, 'TP', 1.5, 'L2', 'Travaux pratiques réseaux'),
(17, 'Bases de Données',             'INFO-L2-BDD-CI',    1, 'CI', 1.5, 'L2', 'Cours bases de données'),
(18, 'Bases de Données TD',          'INFO-L2-BDD-TD',    1, 'TD', 3.0, 'L2', 'Travaux dirigés BDD (3h)'),
(19, 'Bases de Données TP',          'INFO-L2-BDD-TP',    1, 'TP', 1.5, 'L2', 'Travaux pratiques BDD'),
(20, 'Génie Logiciel',               'INFO-L2-GL-CI',     1, 'CI', 3.0, 'L2', 'Cours génie logiciel (3h)');

-- INFO L3 subjects (IDs 21-30)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(21, 'Intelligence Artificielle',    'INFO-L3-IA-CI',     1, 'CI', 1.5, 'L3', 'Cours IA et machine learning'),
(22, 'Intelligence Artificielle TD', 'INFO-L3-IA-TD',     1, 'TD', 1.5, 'L3', 'Travaux dirigés IA'),
(23, 'Intelligence Artificielle TP', 'INFO-L3-IA-TP',     1, 'TP', 1.5, 'L3', 'Travaux pratiques IA'),
(24, 'Sécurité Informatique',        'INFO-L3-SEC-CI',    1, 'CI', 1.5, 'L3', 'Cours cybersécurité'),
(25, 'Sécurité Informatique TD',     'INFO-L3-SEC-TD',    1, 'TD', 1.5, 'L3', 'Travaux dirigés sécurité'),
(26, 'Cloud Computing',              'INFO-L3-CLOUD-CI',  1, 'CI', 3.0, 'L3', 'Cours cloud computing (3h)'),
(27, 'Cloud Computing TP',           'INFO-L3-CLOUD-TP',  1, 'TP', 1.5, 'L3', 'Travaux pratiques cloud'),
(28, 'Big Data',                     'INFO-L3-BD-CI',     1, 'CI', 1.5, 'L3', 'Cours big data et NoSQL'),
(29, 'Big Data TD',                  'INFO-L3-BD-TD',     1, 'TD', 1.5, 'L3', 'Travaux dirigés big data'),
(30, 'Projet de Fin d''Études',      'INFO-L3-PFE-TD',    1, 'TD', 3.0, 'L3', 'Encadrement projet fin études (3h)');

-- MATH L1 subjects (IDs 31-40)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(31, 'Analyse Mathématique',         'MATH-L1-ANAL-CI',  2, 'CI', 1.5, 'L1', 'Cours analyse mathématique'),
(32, 'Analyse Mathématique TD',      'MATH-L1-ANAL-TD',  2, 'TD', 3.0, 'L1', 'Travaux dirigés analyse (3h)'),
(33, 'Algèbre Linéaire',             'MATH-L1-ALG-CI',   2, 'CI', 1.5, 'L1', 'Cours algèbre linéaire'),
(34, 'Algèbre Linéaire TD',          'MATH-L1-ALG-TD',   2, 'TD', 1.5, 'L1', 'Travaux dirigés algèbre'),
(35, 'Probabilités et Statistiques', 'MATH-L1-PROB-CI',  2, 'CI', 1.5, 'L1', 'Cours probabilités'),
(36, 'Probabilités et Statistiques TD','MATH-L1-PROB-TD', 2, 'TD', 1.5, 'L1', 'Travaux dirigés probabilités'),
(37, 'Géométrie',                    'MATH-L1-GEO-CI',   2, 'CI', 1.5, 'L1', 'Cours géométrie'),
(38, 'Géométrie TD',                 'MATH-L1-GEO-TD',   2, 'TD', 1.5, 'L1', 'Travaux dirigés géométrie'),
(39, 'Informatique de Base',         'MATH-L1-INFO-CI',  2, 'CI', 1.5, 'L1', 'Cours informatique pour mathématiciens'),
(40, 'Informatique de Base TP',      'MATH-L1-INFO-TP',  2, 'TP', 1.5, 'L1', 'TP informatique de base');

-- MATH L2 subjects (IDs 41-50)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(41, 'Analyse Numérique',            'MATH-L2-ANUM-CI',  2, 'CI', 1.5, 'L2', 'Cours analyse numérique'),
(42, 'Analyse Numérique TD',         'MATH-L2-ANUM-TD',  2, 'TD', 1.5, 'L2', 'Travaux dirigés analyse numérique'),
(43, 'Analyse Numérique TP',         'MATH-L2-ANUM-TP',  2, 'TP', 1.5, 'L2', 'Travaux pratiques analyse numérique'),
(44, 'Statistiques Inférentielles',  'MATH-L2-STAT-CI',  2, 'CI', 1.5, 'L2', 'Cours statistiques inférentielles'),
(45, 'Statistiques Inférentielles TD','MATH-L2-STAT-TD',  2, 'TD', 3.0, 'L2', 'Travaux dirigés statistiques (3h)'),
(46, 'Optimisation',                 'MATH-L2-OPT-CI',   2, 'CI', 1.5, 'L2', 'Cours optimisation mathématique'),
(47, 'Optimisation TD',              'MATH-L2-OPT-TD',   2, 'TD', 1.5, 'L2', 'Travaux dirigés optimisation'),
(48, 'Équations Différentielles',    'MATH-L2-EDIFF-CI', 2, 'CI', 1.5, 'L2', 'Cours équations différentielles'),
(49, 'Équations Différentielles TD', 'MATH-L2-EDIFF-TD', 2, 'TD', 1.5, 'L2', 'Travaux dirigés équations différentielles'),
(50, 'Calcul Scientifique TP',       'MATH-L2-CALC-TP',  2, 'TP', 3.0, 'L2', 'TP calcul scientifique (3h)');

-- MATH L3 subjects (IDs 51-60)
INSERT INTO subjects (id, name, code, department_id, course_type, hours_per_week, level, description) VALUES
(51, 'Mathématiques Financières',    'MATH-L3-FIN-CI',   2, 'CI', 1.5, 'L3', 'Cours mathématiques financières'),
(52, 'Mathématiques Financières TD', 'MATH-L3-FIN-TD',   2, 'TD', 1.5, 'L3', 'Travaux dirigés mathématiques financières'),
(53, 'Topologie',                    'MATH-L3-TOPO-CI',  2, 'CI', 1.5, 'L3', 'Cours de topologie'),
(54, 'Topologie TD',                 'MATH-L3-TOPO-TD',  2, 'TD', 1.5, 'L3', 'Travaux dirigés topologie'),
(55, 'Recherche Opérationnelle',     'MATH-L3-RO-CI',    2, 'CI', 1.5, 'L3', 'Cours recherche opérationnelle'),
(56, 'Recherche Opérationnelle TD',  'MATH-L3-RO-TD',    2, 'TD', 1.5, 'L3', 'Travaux dirigés recherche opérationnelle'),
(57, 'Modélisation Stochastique',    'MATH-L3-STOCH-CI', 2, 'CI', 3.0, 'L3', 'Cours modélisation stochastique (3h)'),
(58, 'Modélisation Stochastique TD', 'MATH-L3-STOCH-TD', 2, 'TD', 1.5, 'L3', 'Travaux dirigés modélisation stochastique'),
(59, 'Théorie des Jeux',             'MATH-L3-JEU-CI',   2, 'CI', 1.5, 'L3', 'Cours théorie des jeux'),
(60, 'Mémoire de Fin d''Études',     'MATH-L3-MFE-TD',   2, 'TD', 3.0, 'L3', 'Encadrement mémoire de fin études (3h)');

-- =====================================================
-- TIME SLOTS (50 total: 25/dept — 5 slots × 5 days)
-- 08h00-09h30 / 09h45-11h15 / 11h30-13h00
-- 14h00-15h30 / 15h45-17h15
-- =====================================================

-- INFO Department time slots (IDs 1-25)
INSERT INTO time_slots (id, day_of_week, start_time, end_time, department_id) VALUES
(1,  'MONDAY',    '08:00:00', '09:30:00', 1),
(2,  'MONDAY',    '09:45:00', '11:15:00', 1),
(3,  'MONDAY',    '11:30:00', '13:00:00', 1),
(4,  'MONDAY',    '14:00:00', '15:30:00', 1),
(5,  'MONDAY',    '15:45:00', '17:15:00', 1),
(6,  'TUESDAY',   '08:00:00', '09:30:00', 1),
(7,  'TUESDAY',   '09:45:00', '11:15:00', 1),
(8,  'TUESDAY',   '11:30:00', '13:00:00', 1),
(9,  'TUESDAY',   '14:00:00', '15:30:00', 1),
(10, 'TUESDAY',   '15:45:00', '17:15:00', 1),
(11, 'WEDNESDAY', '08:00:00', '09:30:00', 1),
(12, 'WEDNESDAY', '09:45:00', '11:15:00', 1),
(13, 'WEDNESDAY', '11:30:00', '13:00:00', 1),
(14, 'WEDNESDAY', '14:00:00', '15:30:00', 1),
(15, 'WEDNESDAY', '15:45:00', '17:15:00', 1),
(16, 'THURSDAY',  '08:00:00', '09:30:00', 1),
(17, 'THURSDAY',  '09:45:00', '11:15:00', 1),
(18, 'THURSDAY',  '11:30:00', '13:00:00', 1),
(19, 'THURSDAY',  '14:00:00', '15:30:00', 1),
(20, 'THURSDAY',  '15:45:00', '17:15:00', 1),
(21, 'FRIDAY',    '08:00:00', '09:30:00', 1),
(22, 'FRIDAY',    '09:45:00', '11:15:00', 1),
(23, 'FRIDAY',    '11:30:00', '13:00:00', 1),
(24, 'FRIDAY',    '14:00:00', '15:30:00', 1),
(25, 'FRIDAY',    '15:45:00', '17:15:00', 1);

-- MATH Department time slots (IDs 26-50)
INSERT INTO time_slots (id, day_of_week, start_time, end_time, department_id) VALUES
(26, 'MONDAY',    '08:00:00', '09:30:00', 2),
(27, 'MONDAY',    '09:45:00', '11:15:00', 2),
(28, 'MONDAY',    '11:30:00', '13:00:00', 2),
(29, 'MONDAY',    '14:00:00', '15:30:00', 2),
(30, 'MONDAY',    '15:45:00', '17:15:00', 2),
(31, 'TUESDAY',   '08:00:00', '09:30:00', 2),
(32, 'TUESDAY',   '09:45:00', '11:15:00', 2),
(33, 'TUESDAY',   '11:30:00', '13:00:00', 2),
(34, 'TUESDAY',   '14:00:00', '15:30:00', 2),
(35, 'TUESDAY',   '15:45:00', '17:15:00', 2),
(36, 'WEDNESDAY', '08:00:00', '09:30:00', 2),
(37, 'WEDNESDAY', '09:45:00', '11:15:00', 2),
(38, 'WEDNESDAY', '11:30:00', '13:00:00', 2),
(39, 'WEDNESDAY', '14:00:00', '15:30:00', 2),
(40, 'WEDNESDAY', '15:45:00', '17:15:00', 2),
(41, 'THURSDAY',  '08:00:00', '09:30:00', 2),
(42, 'THURSDAY',  '09:45:00', '11:15:00', 2),
(43, 'THURSDAY',  '11:30:00', '13:00:00', 2),
(44, 'THURSDAY',  '14:00:00', '15:30:00', 2),
(45, 'THURSDAY',  '15:45:00', '17:15:00', 2),
(46, 'FRIDAY',    '08:00:00', '09:30:00', 2),
(47, 'FRIDAY',    '09:45:00', '11:15:00', 2),
(48, 'FRIDAY',    '11:30:00', '13:00:00', 2),
(49, 'FRIDAY',    '14:00:00', '15:30:00', 2),
(50, 'FRIDAY',    '15:45:00', '17:15:00', 2);

-- =====================================================
-- PROFESSOR → SUBJECT ASSIGNMENTS
-- =====================================================
INSERT INTO professor_subjects (professor_id, subject_id) VALUES
-- Prof 1 (Karim Ben Ammar): Intro Programmation CI+TD+TP
(1, 1), (1, 2), (1, 3),
-- Prof 2 (Leila Boukhris): Math Discrètes + Architecture
(2, 4), (2, 5), (2, 6), (2, 7),
-- Prof 3 (Hassan Chaabane): SE + Logique + Init TP
(3, 8), (3, 9), (3, 10),
-- Prof 4 (Amira Dridi): Algo Avancée CI+TD+TP
(4, 11), (4, 12), (4, 13),
-- Prof 5 (Nizar Essid): Réseaux CI+TD+TP
(5, 14), (5, 15), (5, 16),
-- Prof 6 (Sonia Fakhfakh): BDD CI+TD+TP + Génie Logiciel
(6, 17), (6, 18), (6, 19), (6, 20),
-- Prof 7 (Tarek Gharbi): IA CI+TD+TP
(7, 21), (7, 22), (7, 23),
-- Prof 8 (Ines Hamdi): Sécurité CI+TD + Cloud CI+TP
(8, 24), (8, 25), (8, 26), (8, 27),
-- Prof 9 (Walid Jendoubi): Big Data CI+TD + PFE
(9, 28), (9, 29), (9, 30),
-- Prof 10 (Fatma Karray): Analyse CI + TD + Algèbre CI+TD
(10, 31), (10, 32), (10, 33), (10, 34),
-- Prof 11 (Ali Laabidi): Proba CI+TD + Géométrie CI+TD
(11, 35), (11, 36), (11, 37), (11, 38),
-- Prof 12 (Rania Mansouri): Info de Base CI+TP
(12, 39), (12, 40),
-- Prof 13 (Slim Nasri): Analyse Numérique CI+TD+TP
(13, 41), (13, 42), (13, 43),
-- Prof 14 (Amel Ouali): Statistiques CI+TD + Optimisation CI+TD
(14, 44), (14, 45), (14, 46), (14, 47),
-- Prof 15 (Mehdi Riahi): Eq Diff CI+TD + Calcul Sci TP
(15, 48), (15, 49), (15, 50),
-- Prof 16 (Sirine Sfaxi): Math Fin CI+TD + Topologie CI+TD
(16, 51), (16, 52), (16, 53), (16, 54),
-- Prof 17 (Youssef Trabelsi): Rech Op CI+TD + Modélisation CI+TD
(17, 55), (17, 56), (17, 57), (17, 58),
-- Prof 18 (Imen Turki): Théorie Jeux + Mémoire
(18, 59), (18, 60);

SET FOREIGN_KEY_CHECKS = 1;
