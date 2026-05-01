package com.planify.optaplanner.domain;

import com.planify.model.Classroom;
import com.planify.model.TimeSlot;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;

import java.util.List;

/**
 * PlanningSolution: represents the complete timetable problem.
 * Contains the problem facts and the planning entities.
 */
@PlanningSolution
@Getter @Setter @NoArgsConstructor
public class TimeTable {

    /** Problem facts: available time slots (value range for PlanningVariable). */
    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "timeSlotRange")
    private List<TimeSlot> timeSlots;

    /** Problem facts: available classrooms (value range for PlanningVariable). */
    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "classroomRange")
    private List<Classroom> classrooms;

    /** Planning entities: lessons that need to be assigned a time slot and classroom. */
    @PlanningEntityCollectionProperty
    private List<Lesson> lessons;

    /** The score computed by the constraint provider. */
    @PlanningScore
    private HardSoftScore score;

    public TimeTable(List<TimeSlot> timeSlots, List<Classroom> classrooms, List<Lesson> lessons) {
        this.timeSlots = timeSlots;
        this.classrooms = classrooms;
        this.lessons = lessons;
    }
}
