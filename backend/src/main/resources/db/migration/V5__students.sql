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
