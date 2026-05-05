package com.planify.optaplanner.constraints;

import com.planify.model.enums.ClassroomType;
import com.planify.model.enums.CourseType;
import com.planify.optaplanner.domain.Lesson;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

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
            spreadGroupLessonsAcrossDays(factory),
            limitDailyLessonsPerGroup(factory),
            professorSlotPreference(factory),
            minimizeGapsInStudentSchedule(factory)
        };
    }

    // =========================================================
    // HARD CONSTRAINTS
    // =========================================================

    Constraint professorConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getProfessor().getId()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Professor conflict");
    }

    Constraint classroomConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getClassroom() != null ? lesson.getClassroom().getId() : null))
                .filter((l1, l2) -> l1.getClassroom() != null && l2.getClassroom() != null)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Classroom conflict");
    }

    Constraint studentGroupConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(lesson -> lesson.getTimeSlot()),
                    Joiners.equal(lesson -> lesson.getStudentGroup().getId()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Student group conflict");
    }

    Constraint professorAvailability(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null && lesson.getProfessor() != null)
                .filter(lesson -> lesson.getProfessor().getAvailabilities().stream()
                        .anyMatch(a -> a.getTimeSlot().getId().equals(lesson.getTimeSlot().getId()) && !a.isAvailable()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Professor unavailable");
    }

    /**
     * TP must go to LABORATORY, TD to TD_ROOM, CI to AMPHITHEATER.
     * Penalized heavily so the solver always satisfies this before other concerns.
     */
    Constraint classroomTypeSuitability(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getClassroom() != null && lesson.getSubject() != null)
                .filter(lesson -> !isRoomSuitable(lesson.getSubject().getCourseType(), lesson.getClassroom().getType()))
                .penalize(HardSoftScore.ofHard(10))
                .asConstraint("Classroom type mismatch");
    }

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
     * Spread lessons from the same group across different days.
     * Penalizes pairs of lessons from the same group scheduled on the SAME day —
     * the opposite of the old "consecutive" constraint that caused clustering.
     */
    Constraint spreadGroupLessonsAcrossDays(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(l -> l.getStudentGroup().getId()))
                .filter((l1, l2) -> l1.getTimeSlot() != null && l2.getTimeSlot() != null)
                .filter((l1, l2) -> l1.getTimeSlot().getDayOfWeek() == l2.getTimeSlot().getDayOfWeek())
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Spread group lessons across days");
    }

    /**
     * Hard cap on daily load: more than 3 lessons per group per day is penalized progressively.
     */
    Constraint limitDailyLessonsPerGroup(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null)
                .groupBy(
                    l -> l.getStudentGroup().getId(),
                    l -> l.getTimeSlot().getDayOfWeek(),
                    org.optaplanner.core.api.score.stream.ConstraintCollectors.count()
                )
                .filter((groupId, day, count) -> count > 3)
                .penalize(HardSoftScore.ofSoft(5),
                    (groupId, day, count) -> count - 3)
                .asConstraint("Daily lesson limit per group");
    }

    /**
     * Respect professor timeslot preferences.
     * Penalizes scheduling a lesson in a timeslot the professor wants to avoid.
     */
    Constraint professorSlotPreference(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
                .filter(lesson -> lesson.getTimeSlot() != null)
                .filter(lesson -> !lesson.getAvoidedTimeSlotIds().isEmpty())
                .filter(lesson -> lesson.getAvoidedTimeSlotIds().contains(lesson.getTimeSlot().getId()))
                .penalize(HardSoftScore.ofSoft(3))
                .asConstraint("Professor slot preference");
    }

    /**
     * Minimize gaps larger than 2 hours between sessions for the same group on the same day.
     */
    Constraint minimizeGapsInStudentSchedule(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                    Joiners.equal(l -> l.getStudentGroup().getId()),
                    Joiners.equal(l -> l.getTimeSlot() != null ? l.getTimeSlot().getDayOfWeek() : null))
                .filter((l1, l2) -> l1.getTimeSlot() != null && l2.getTimeSlot() != null)
                .filter((l1, l2) -> {
                    int start1 = l1.getTimeSlot().getStartTime().getHour();
                    int start2 = l2.getTimeSlot().getStartTime().getHour();
                    return Math.abs(start1 - start2) > 4;
                })
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Minimize schedule gaps");
    }

    // =========================================================
    // HELPER
    // =========================================================

    private boolean isRoomSuitable(CourseType courseType, ClassroomType classroomType) {
        return switch (courseType) {
            case CI -> classroomType == ClassroomType.AMPHITHEATER;
            case TD -> classroomType == ClassroomType.TD_ROOM;
            case TP -> classroomType == ClassroomType.LABORATORY;
        };
    }
}
