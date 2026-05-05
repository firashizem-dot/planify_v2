CREATE TABLE IF NOT EXISTS professor_preferences (
    id              BIGINT  NOT NULL AUTO_INCREMENT,
    professor_id    BIGINT  NOT NULL,
    time_slot_id    BIGINT  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_professor_preference (professor_id, time_slot_id),
    CONSTRAINT fk_pref_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
    CONSTRAINT fk_pref_timeslot FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
