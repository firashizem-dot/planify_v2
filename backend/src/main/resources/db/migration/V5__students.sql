-- Students table: links a user account (role=STUDENT) to a student group
CREATE TABLE IF NOT EXISTS students (
    id               BIGINT NOT NULL AUTO_INCREMENT,
    user_id          BIGINT NOT NULL,
    student_group_id BIGINT NOT NULL,
    created_at       DATETIME(6),
    updated_at       DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_students_user (user_id),
    CONSTRAINT fk_students_user  FOREIGN KEY (user_id)          REFERENCES users(id)          ON DELETE CASCADE,
    CONSTRAINT fk_students_group FOREIGN KEY (student_group_id) REFERENCES student_groups(id) ON DELETE RESTRICT,
    INDEX idx_students_group (student_group_id)
);

-- Constraint violations: store which constraints were violated during schedule generation
ALTER TABLE schedules ADD COLUMN constraint_violations TEXT NULL AFTER soft_score;

-- =====================================================
-- STUDENTS — 150 records (25 per group × 6 groups)
-- user_id ranges:
--   22-46  → group 1 (INFO L1)
--   47-71  → group 2 (INFO L2)
--   72-96  → group 3 (INFO L3)
--   97-121 → group 4 (MATH L1)
--  122-146 → group 5 (MATH L2)
--  147-171 → group 6 (MATH L3)
-- =====================================================

-- INFO L1 students (group 1)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(1,  22, 1, NOW(), NOW()),
(2,  23, 1, NOW(), NOW()),
(3,  24, 1, NOW(), NOW()),
(4,  25, 1, NOW(), NOW()),
(5,  26, 1, NOW(), NOW()),
(6,  27, 1, NOW(), NOW()),
(7,  28, 1, NOW(), NOW()),
(8,  29, 1, NOW(), NOW()),
(9,  30, 1, NOW(), NOW()),
(10, 31, 1, NOW(), NOW()),
(11, 32, 1, NOW(), NOW()),
(12, 33, 1, NOW(), NOW()),
(13, 34, 1, NOW(), NOW()),
(14, 35, 1, NOW(), NOW()),
(15, 36, 1, NOW(), NOW()),
(16, 37, 1, NOW(), NOW()),
(17, 38, 1, NOW(), NOW()),
(18, 39, 1, NOW(), NOW()),
(19, 40, 1, NOW(), NOW()),
(20, 41, 1, NOW(), NOW()),
(21, 42, 1, NOW(), NOW()),
(22, 43, 1, NOW(), NOW()),
(23, 44, 1, NOW(), NOW()),
(24, 45, 1, NOW(), NOW()),
(25, 46, 1, NOW(), NOW());

-- INFO L2 students (group 2)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(26, 47, 2, NOW(), NOW()),
(27, 48, 2, NOW(), NOW()),
(28, 49, 2, NOW(), NOW()),
(29, 50, 2, NOW(), NOW()),
(30, 51, 2, NOW(), NOW()),
(31, 52, 2, NOW(), NOW()),
(32, 53, 2, NOW(), NOW()),
(33, 54, 2, NOW(), NOW()),
(34, 55, 2, NOW(), NOW()),
(35, 56, 2, NOW(), NOW()),
(36, 57, 2, NOW(), NOW()),
(37, 58, 2, NOW(), NOW()),
(38, 59, 2, NOW(), NOW()),
(39, 60, 2, NOW(), NOW()),
(40, 61, 2, NOW(), NOW()),
(41, 62, 2, NOW(), NOW()),
(42, 63, 2, NOW(), NOW()),
(43, 64, 2, NOW(), NOW()),
(44, 65, 2, NOW(), NOW()),
(45, 66, 2, NOW(), NOW()),
(46, 67, 2, NOW(), NOW()),
(47, 68, 2, NOW(), NOW()),
(48, 69, 2, NOW(), NOW()),
(49, 70, 2, NOW(), NOW()),
(50, 71, 2, NOW(), NOW());

-- INFO L3 students (group 3)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(51, 72, 3, NOW(), NOW()),
(52, 73, 3, NOW(), NOW()),
(53, 74, 3, NOW(), NOW()),
(54, 75, 3, NOW(), NOW()),
(55, 76, 3, NOW(), NOW()),
(56, 77, 3, NOW(), NOW()),
(57, 78, 3, NOW(), NOW()),
(58, 79, 3, NOW(), NOW()),
(59, 80, 3, NOW(), NOW()),
(60, 81, 3, NOW(), NOW()),
(61, 82, 3, NOW(), NOW()),
(62, 83, 3, NOW(), NOW()),
(63, 84, 3, NOW(), NOW()),
(64, 85, 3, NOW(), NOW()),
(65, 86, 3, NOW(), NOW()),
(66, 87, 3, NOW(), NOW()),
(67, 88, 3, NOW(), NOW()),
(68, 89, 3, NOW(), NOW()),
(69, 90, 3, NOW(), NOW()),
(70, 91, 3, NOW(), NOW()),
(71, 92, 3, NOW(), NOW()),
(72, 93, 3, NOW(), NOW()),
(73, 94, 3, NOW(), NOW()),
(74, 95, 3, NOW(), NOW()),
(75, 96, 3, NOW(), NOW());

-- MATH L1 students (group 4)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(76,  97,  4, NOW(), NOW()),
(77,  98,  4, NOW(), NOW()),
(78,  99,  4, NOW(), NOW()),
(79,  100, 4, NOW(), NOW()),
(80,  101, 4, NOW(), NOW()),
(81,  102, 4, NOW(), NOW()),
(82,  103, 4, NOW(), NOW()),
(83,  104, 4, NOW(), NOW()),
(84,  105, 4, NOW(), NOW()),
(85,  106, 4, NOW(), NOW()),
(86,  107, 4, NOW(), NOW()),
(87,  108, 4, NOW(), NOW()),
(88,  109, 4, NOW(), NOW()),
(89,  110, 4, NOW(), NOW()),
(90,  111, 4, NOW(), NOW()),
(91,  112, 4, NOW(), NOW()),
(92,  113, 4, NOW(), NOW()),
(93,  114, 4, NOW(), NOW()),
(94,  115, 4, NOW(), NOW()),
(95,  116, 4, NOW(), NOW()),
(96,  117, 4, NOW(), NOW()),
(97,  118, 4, NOW(), NOW()),
(98,  119, 4, NOW(), NOW()),
(99,  120, 4, NOW(), NOW()),
(100, 121, 4, NOW(), NOW());

-- MATH L2 students (group 5)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(101, 122, 5, NOW(), NOW()),
(102, 123, 5, NOW(), NOW()),
(103, 124, 5, NOW(), NOW()),
(104, 125, 5, NOW(), NOW()),
(105, 126, 5, NOW(), NOW()),
(106, 127, 5, NOW(), NOW()),
(107, 128, 5, NOW(), NOW()),
(108, 129, 5, NOW(), NOW()),
(109, 130, 5, NOW(), NOW()),
(110, 131, 5, NOW(), NOW()),
(111, 132, 5, NOW(), NOW()),
(112, 133, 5, NOW(), NOW()),
(113, 134, 5, NOW(), NOW()),
(114, 135, 5, NOW(), NOW()),
(115, 136, 5, NOW(), NOW()),
(116, 137, 5, NOW(), NOW()),
(117, 138, 5, NOW(), NOW()),
(118, 139, 5, NOW(), NOW()),
(119, 140, 5, NOW(), NOW()),
(120, 141, 5, NOW(), NOW()),
(121, 142, 5, NOW(), NOW()),
(122, 143, 5, NOW(), NOW()),
(123, 144, 5, NOW(), NOW()),
(124, 145, 5, NOW(), NOW()),
(125, 146, 5, NOW(), NOW());

-- MATH L3 students (group 6)
INSERT INTO students (id, user_id, student_group_id, created_at, updated_at) VALUES
(126, 147, 6, NOW(), NOW()),
(127, 148, 6, NOW(), NOW()),
(128, 149, 6, NOW(), NOW()),
(129, 150, 6, NOW(), NOW()),
(130, 151, 6, NOW(), NOW()),
(131, 152, 6, NOW(), NOW()),
(132, 153, 6, NOW(), NOW()),
(133, 154, 6, NOW(), NOW()),
(134, 155, 6, NOW(), NOW()),
(135, 156, 6, NOW(), NOW()),
(136, 157, 6, NOW(), NOW()),
(137, 158, 6, NOW(), NOW()),
(138, 159, 6, NOW(), NOW()),
(139, 160, 6, NOW(), NOW()),
(140, 161, 6, NOW(), NOW()),
(141, 162, 6, NOW(), NOW()),
(142, 163, 6, NOW(), NOW()),
(143, 164, 6, NOW(), NOW()),
(144, 165, 6, NOW(), NOW()),
(145, 166, 6, NOW(), NOW()),
(146, 167, 6, NOW(), NOW()),
(147, 168, 6, NOW(), NOW()),
(148, 169, 6, NOW(), NOW()),
(149, 170, 6, NOW(), NOW()),
(150, 171, 6, NOW(), NOW());
