package com.planify.optaplanner.constraints;

import com.planify.model.enums.ClassroomType;
import com.planify.model.enums.CourseType;
import com.planify.optaplanner.domain.Lesson;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

/**
 * OptaPlanner Constraint Provider using Constraint Streams API.
 *
 * Hard constraints (MUST NOT be violated) - IA-C01 to IA-C06
 * Soft constraints (optimized) - IA-C07 to IA-C10
 */
public class TimeTableConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[]{
            // Hard constraints
            professorConflict(factory),
            classroomConflict(factory),
            studentGroupConflict(factory),
            professorAvailability(factory),
            classroomTypeSuitability(factory),
            classroomCapacity(factory),
            // Soft constraints
            professorTimePreference(factory),
            minimizeGapsInStudentSchedule(factory),
            balanceStudentDailyLoad(factory),
            groupConsecutiveLessons(factory)
        };
    }

    // =========================================================
    // HARD CONSTRAINTS
    // =========================================================

    /**
     * IA-C01: A professor cannot have two classes at the same time.
     */
    Constraint professorConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getProfessor().getId()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Professor conflict");
    }

    /**
     * IA-C02: A classroom cannot be used by two groups simultaneously.
     */
    Constraint classroomConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getClassroom() != null ? lesson.getClassroom().getId() : null))
                .filter((l1, l2) -> l1.getClassroom() != null && l2.getClassroom() != null)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Classroom conflict");
    }

    /**
     * Student group cannot have two classes at the same time.
     */
    Constraint studentGroupConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getStudentGroup().getId()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Student group conflict");
    }

    /**
     * IA-C03: Professor must be available in the assigned time slot.
     * Availability is tracked in the professor's availabilities set.
     */
    Constraint professorAvailability(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null && lesson.getProfessor() != null)
                .filter(lesson -> lesson.getProfessor().getAvailabilities().stream()
                        .anyMatch(a -> a.getTimeSlot().getId().equals(lesson.getTimeSlot().getId()) && !a.isAvailable()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Professor unavailable");
    }

    /**
     * IA-C05: Room type must match course type:
     * - CI (Magistral) -> AMPHITHEATER
     * - TD             -> TD_ROOM
     * - TP             -> LABORATORY
     */
    Constraint classroomTypeSuitability(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getClassroom() != null && lesson.getSubject() != null)
                .filter(lesson -> !isRoomSuitable(lesson.getSubject().getCourseType(), lesson.getClassroom().getType()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Classroom type mismatch");
    }

    /**
     * IA-C06: Classroom capacity must fit the student group size.
     */
    Constraint classroomCapacity(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getClassroom() != null && lesson.getStudentGroup() != null)
                .filter(lesson -> lesson.getClassroom().getCapacity() < lesson.getStudentGroup().getStudentCount())
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Classroom too small");
    }

    // =========================================================
    // SOFT CONSTRAINTS
    // =========================================================

    /**
     * IA-C09: Respect professor time slot preferences.
     * Penalize when lessons are at non-preferred times.
     * (Here we use a simple heuristic: prefer morning slots)
     */
    Constraint professorTimePreference(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null)
                // Penalize if lesson starts after 15:00 (afternoon preference)
                .filter(lesson -> lesson.getTimeSlot().getStartTime().getHour() >= 15)
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Prefer morning slots");
    }

    /**
     * IA-C08: Minimize gaps in student group schedule.
     * Penalize lessons from same group that leave large gaps.
     */
    Constraint minimizeGapsInStudentSchedule(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(l -> l.getStudentGroup().getId()),
                    Joiners.equal(l -> l.getTimeSlot() != null ? l.getTimeSlot().getDayOfWeek() : null))
                .filter((l1, l2) -> l1.getTimeSlot() != null && l2.getTimeSlot() != null)
                .filter((l1, l2) -> {
                    int start1 = l1.getTimeSlot().getStartTime().getHour();
                    int start2 = l2.getTimeSlot().getStartTime().getHour();
                    // Gap > 2 hours between sessions on the same day
                    return Math.abs(start1 - start2) > 4;
                })
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Minimize schedule gaps");
    }

    /**
     * IA-C07: Balance daily student load - avoid more than 4 lessons per day per group.
     */
    Constraint balanceStudentDailyLoad(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null)
                .groupBy(
                    l -> l.getStudentGroup().getId(),
                    l -> l.getTimeSlot().getDayOfWeek(),
                    org.optaplanner.core.api.score.stream.ConstraintCollectors.count()
                )
                .filter((groupId, day, count) -> count > 4)
                .penalize(HardSoftScore.ONE_SOFT,
                    (groupId, day, count) -> count - 4)
                .asConstraint("Student daily load balance");
    }

    /**
     * IA-C10: Group lessons from the same group on continuous time blocks when possible.
     */
    Constraint groupConsecutiveLessons(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(l -> l.getStudentGroup().getId()))
                .filter((l1, l2) -> l1.getTimeSlot() != null && l2.getTimeSlot() != null)
                .filter((l1, l2) -> l1.getTimeSlot().getDayOfWeek() != l2.getTimeSlot().getDayOfWeek())
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Group consecutive lessons");
    }

    // =========================================================
    // HELPER METHODS
    // =========================================================

    private boolean isRoomSuitable(CourseType courseType, ClassroomType classroomType) {
        return switch (courseType) {
            case CI -> classroomType == ClassroomType.AMPHITHEATER;
            case TD -> classroomType == ClassroomType.TD_ROOM;
            case TP -> classroomType == ClassroomType.LABORATORY;
        };
    }
}
