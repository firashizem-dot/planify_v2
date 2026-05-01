package com.planify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professor_availabilities",
    uniqueConstraints = @UniqueConstraint(columnNames = {"professor_id", "time_slot_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfessorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private boolean available = true;
}
