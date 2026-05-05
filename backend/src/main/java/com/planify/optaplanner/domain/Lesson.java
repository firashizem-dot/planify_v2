package com.planify.optaplanner.domain;

import com.planify.model.Classroom;
import com.planify.model.Professor;
import com.planify.model.StudentGroup;
import com.planify.model.Subject;
import com.planify.model.TimeSlot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

import java.util.HashSet;
import java.util.Set;

/**
 * PlanningEntity: represents one lesson/session to be scheduled.
 * OptaPlanner will assign a timeSlot and a classroom to each Lesson.
 */
@PlanningEntity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @PlanningId
    private Long id;

    /** Fixed fields (problem facts) - not modified by the solver. */
    private Subject subject;
    private Professor professor;
    private StudentGroup studentGroup;
    private Set<Long> avoidedTimeSlotIds = new HashSet<>();

    /** Planning variables - OptaPlanner assigns these. */
    @PlanningVariable(valueRangeProviderRefs = "timeSlotRange")
    private TimeSlot timeSlot;

    @PlanningVariable(valueRangeProviderRefs = "classroomRange")
    private Classroom classroom;

    public Lesson(Long id, Subject subject, Professor professor, StudentGroup studentGroup) {
        this.id = id;
        this.subject = subject;
        this.professor = professor;
        this.studentGroup = studentGroup;
    }

    public Lesson(Long id, Subject subject, Professor professor, StudentGroup studentGroup, Set<Long> avoidedTimeSlotIds) {
        this.id = id;
        this.subject = subject;
        this.professor = professor;
        this.studentGroup = studentGroup;
        this.avoidedTimeSlotIds = avoidedTimeSlotIds != null ? avoidedTimeSlotIds : new HashSet<>();
    }

    @Override
    public String toString() {
        return "Lesson{" + id + ", " + subject.getCode() + ", " +
                (timeSlot != null ? timeSlot.getLabel() : "unassigned") + "}";
    }
}
