package com.planify.optaplanner.constraints;

import com.planify.model.Classroom;
import com.planify.model.Professor;
import com.planify.model.StudentGroup;
import com.planify.model.Subject;
import com.planify.model.TimeSlot;
import com.planify.model.enums.ClassroomType;
import com.planify.model.enums.CourseType;
import com.planify.model.enums.DayOfWeek;
import com.planify.optaplanner.domain.Lesson;
import com.planify.optaplanner.domain.TimeTable;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.optaplanner.test.api.score.stream.ConstraintVerifier;

import java.time.LocalTime;

/**
 * Tests unitaires boîte blanche des contraintes OptaPlanner.
 * Cas Qase : Planify-8 (TC-PLAN-C01), Planify-12 (TC-PLAN-C05), Planify-13 (TC-PLAN-C06), Planify-14 (TC-PLAN-SOFT-01).
 * Lancement : mvn test -Dtest=TimeTableConstraintProviderTest
 */
class TimeTableConstraintProviderTest {

    private final ConstraintVerifier<TimeTableConstraintProvider, TimeTable> verifier =
            ConstraintVerifier.build(new TimeTableConstraintProvider(), TimeTable.class, Lesson.class);

    private static final TimeSlot MONDAY_08 = slot(1L, DayOfWeek.MONDAY, 8);
    private static final TimeSlot MONDAY_10 = slot(2L, DayOfWeek.MONDAY, 10);
    private static final TimeSlot MONDAY_11 = slot(3L, DayOfWeek.MONDAY, 11);
    private static final TimeSlot MONDAY_14 = slot(4L, DayOfWeek.MONDAY, 14);

    private static TimeSlot slot(Long id, DayOfWeek day, int hour) {
        return TimeSlot.builder().id(id).dayOfWeek(day)
                .startTime(LocalTime.of(hour, 0)).endTime(LocalTime.of(hour + 1, 30)).build();
    }

    private static Professor prof(Long id) {
        return Professor.builder().id(id).build();
    }

    private static StudentGroup group(Long id, int students) {
        return StudentGroup.builder().id(id).code("G" + id).studentCount(students).build();
    }

    private static Classroom room(Long id, ClassroomType type, int capacity) {
        return Classroom.builder().id(id).code("R" + id).type(type).capacity(capacity).build();
    }

    private static Subject subject(Long id, CourseType type) {
        return Subject.builder().id(id).code("S" + id).courseType(type).build();
    }

    private static Lesson lesson(Long id, Subject s, Professor p, StudentGroup g, TimeSlot t, Classroom r) {
        Lesson l = new Lesson(id, s, p, g);
        l.setTimeSlot(t);
        l.setClassroom(r);
        return l;
    }

    @Test
    @DisplayName("Planify-8 — même professeur, même créneau : 1 pénalité dure")
    void professorConflict_sameSlot_penalizes() {
        Professor p = prof(1L);
        Lesson a = lesson(1L, subject(1L, CourseType.CI), p, group(1L, 25), MONDAY_08, room(1L, ClassroomType.AMPHITHEATER, 200));
        Lesson b = lesson(2L, subject(2L, CourseType.CI), p, group(2L, 25), MONDAY_08, room(2L, ClassroomType.AMPHITHEATER, 200));
        verifier.verifyThat(TimeTableConstraintProvider::professorConflict).given(a, b).penalizesBy(1);
    }

    @Test
    @DisplayName("Planify-8 — même professeur, créneaux différents : aucune pénalité")
    void professorConflict_differentSlots_noPenalty() {
        Professor p = prof(1L);
        Lesson a = lesson(1L, subject(1L, CourseType.CI), p, group(1L, 25), MONDAY_08, room(1L, ClassroomType.AMPHITHEATER, 200));
        Lesson b = lesson(2L, subject(2L, CourseType.CI), p, group(2L, 25), MONDAY_10, room(1L, ClassroomType.AMPHITHEATER, 200));
        verifier.verifyThat(TimeTableConstraintProvider::professorConflict).given(a, b).penalizesBy(0);
    }

    @Test
    @DisplayName("Planify-12 — TD placé en laboratoire : type de salle incorrect")
    void classroomType_tdInLab_penalizes() {
        Lesson l = lesson(1L, subject(1L, CourseType.TD), prof(1L), group(1L, 25), MONDAY_08, room(1L, ClassroomType.LABORATORY, 25));
        verifier.verifyThat(TimeTableConstraintProvider::classroomTypeSuitability).given(l).penalizesBy(1);
    }

    @Test
    @DisplayName("Planify-12 — CI/TD/TP dans la bonne salle : aucune pénalité")
    void classroomType_matching_noPenalty() {
        Lesson ci = lesson(1L, subject(1L, CourseType.CI), prof(1L), group(1L, 25), MONDAY_08, room(1L, ClassroomType.AMPHITHEATER, 200));
        Lesson td = lesson(2L, subject(2L, CourseType.TD), prof(2L), group(2L, 25), MONDAY_08, room(2L, ClassroomType.TD_ROOM, 30));
        Lesson tp = lesson(3L, subject(3L, CourseType.TP), prof(3L), group(3L, 25), MONDAY_08, room(3L, ClassroomType.LABORATORY, 25));
        verifier.verifyThat(TimeTableConstraintProvider::classroomTypeSuitability).given(ci, td, tp).penalizesBy(0);
    }

    @Test
    @DisplayName("Planify-13 — capacité : 24 et 25 étudiants dans 25 places acceptés (borne)")
    void classroomCapacity_atBoundary_noPenalty() {
        Classroom lab = room(1L, ClassroomType.LABORATORY, 25);
        Lesson g24 = lesson(1L, subject(1L, CourseType.TP), prof(1L), group(1L, 24), MONDAY_08, lab);
        Lesson g25 = lesson(2L, subject(2L, CourseType.TP), prof(2L), group(2L, 25), MONDAY_10, lab);
        verifier.verifyThat(TimeTableConstraintProvider::classroomCapacity).given(g24, g25).penalizesBy(0);
    }

    @Test
    @DisplayName("Planify-13 — capacité : 26 étudiants dans 25 places refusés (borne + 1)")
    void classroomCapacity_aboveBoundary_penalizes() {
        Lesson g26 = lesson(1L, subject(1L, CourseType.TP), prof(1L), group(1L, 26), MONDAY_08, room(1L, ClassroomType.LABORATORY, 25));
        verifier.verifyThat(TimeTableConstraintProvider::classroomCapacity).given(g26).penalizesBy(1);
    }

    @Test
    @DisplayName("Planify-14 — 3 cours le même jour : pas de pénalité ; 4 cours : pénalité de 1")
    void dailyLimit_boundary() {
        StudentGroup g = group(1L, 25);
        Lesson l1 = lesson(1L, subject(1L, CourseType.CI), prof(1L), g, MONDAY_08, null);
        Lesson l2 = lesson(2L, subject(2L, CourseType.CI), prof(2L), g, MONDAY_10, null);
        Lesson l3 = lesson(3L, subject(3L, CourseType.CI), prof(3L), g, MONDAY_11, null);
        Lesson l4 = lesson(4L, subject(4L, CourseType.CI), prof(4L), g, MONDAY_14, null);
        verifier.verifyThat(TimeTableConstraintProvider::limitDailyLessonsPerGroup).given(l1, l2, l3).penalizesBy(0);
        verifier.verifyThat(TimeTableConstraintProvider::limitDailyLessonsPerGroup).given(l1, l2, l3, l4).penalizesBy(1);
    }
}
