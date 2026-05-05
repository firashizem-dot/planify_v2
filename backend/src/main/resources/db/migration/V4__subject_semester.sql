ALTER TABLE subjects
    ADD COLUMN semester VARCHAR(10) NULL AFTER level;

CREATE INDEX idx_subjects_semester ON subjects (semester);
