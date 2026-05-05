-- Assign semesters to all seed subjects.
-- The 'semester' column was added in V4; values are set here (after V4 runs).
-- INFO dept: L1→S1, L2→S3, L3→S5
-- MATH dept: L1→S1, L2→S3, L3→S5

UPDATE subjects SET semester = 'S1' WHERE id BETWEEN 1  AND 10;
UPDATE subjects SET semester = 'S3' WHERE id BETWEEN 11 AND 20;
UPDATE subjects SET semester = 'S5' WHERE id BETWEEN 21 AND 30;
UPDATE subjects SET semester = 'S1' WHERE id BETWEEN 31 AND 40;
UPDATE subjects SET semester = 'S3' WHERE id BETWEEN 41 AND 50;
UPDATE subjects SET semester = 'S5' WHERE id BETWEEN 51 AND 60;
