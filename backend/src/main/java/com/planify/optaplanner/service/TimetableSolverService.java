package com.planify.optaplanner.service;

import com.planify.dto.GenerateScheduleRequest;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.*;
import com.planify.model.enums.ScheduleStatus;
import com.planify.optaplanner.domain.Lesson;
import com.planify.optaplanner.domain.TimeTable;
import com.planify.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planify.optaplanner.constraints.TimeTableConstraintProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Orchestrates the full OptaPlanner solve pipeline:
 * Request -> Build Problem -> Solve -> Persist Solution
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TimetableSolverService {

    private final DepartmentRepository departmentRepository;
    private final ProfessorRepository professorRepository;
    private final SubjectRepository subjectRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentGroupRepository groupRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleSessionRepository sessionRepository;

    /**
     * Full solve pipeline: builds the problem, runs OptaPlanner, persists results.
     */
    @Transactional
    public Schedule generateSchedule(GenerateScheduleRequest request, User createdBy) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));

        // Gather problem data
        List<TimeSlot> timeSlots = timeSlotRepository.findByDepartmentIdOrderByDayOfWeekAscStartTimeAsc(dept.getId());
        List<Classroom> classrooms = classroomRepository.findAll();
        List<Professor> professors = professorRepository.findByDepartmentIdWithDetails(dept.getId());
        List<Subject> subjects = subjectRepository.findByDepartmentId(dept.getId());
        List<StudentGroup> groups = groupRepository.findByDepartmentId(dept.getId());

        if (timeSlots.isEmpty()) throw new BadRequestException("No time slots defined for department");
        if (classrooms.isEmpty()) throw new BadRequestException("No classrooms available");
        if (professors.isEmpty()) throw new BadRequestException("No professors in department");
        if (subjects.isEmpty()) throw new BadRequestException("No subjects in department");
        if (groups.isEmpty()) throw new BadRequestException("No student groups in department");

        // Build lessons (one lesson per subject per group, per hour defined)
        List<Lesson> lessons = buildLessons(subjects, professors, groups);
        log.info("Built {} lessons for department {}", lessons.size(), dept.getName());

        // Create OptaPlanner problem
        TimeTable problem = new TimeTable(timeSlots, classrooms, lessons);

        // Configure solver
        int solveSeconds = request.getSolveSeconds() != null ? request.getSolveSeconds() : 30;
        SolverFactory<TimeTable> solverFactory = buildSolverFactory(solveSeconds);

        // Run the solver
        long startMs = System.currentTimeMillis();
        TimeTable solution = solverFactory.buildSolver().solve(problem);
        long durationMs = System.currentTimeMillis() - startMs;

        HardSoftScore score = solution.getScore();
        log.info("Solve completed in {}ms. Score: {}", durationMs, score);

        // Persist the solution
        return persistSolution(solution, dept, request.getSemester(), request.getAcademicYear(),
                               score, durationMs, createdBy);
    }

    /**
     * Builds the list of lessons from subjects, professors, and groups.
     * Each subject needs sessions based on its hours-per-week.
     */
    private List<Lesson> buildLessons(List<Subject> subjects, List<Professor> professors,
                                       List<StudentGroup> groups) {
        List<Lesson> lessons = new ArrayList<>();
        AtomicLong idGen = new AtomicLong(1);

        for (Subject subject : subjects) {
            // Find professors who teach this subject
            List<Professor> subjectProfessors = professors.stream()
                    .filter(p -> p.getSubjects().stream()
                            .anyMatch(s -> s.getId().equals(subject.getId())))
                    .toList();

            if (subjectProfessors.isEmpty()) {
                log.warn("No professor assigned for subject {}", subject.getCode());
                continue;
            }

            Professor assignedProf = subjectProfessors.get(0);

            // Determine number of sessions per week (1.5h per session)
            int sessionsPerWeek = Math.max(1, (int) Math.ceil(
                    subject.getHoursPerWeek().doubleValue() / 1.5));

            for (StudentGroup group : groups) {
                // Only assign if group level matches subject level
                if (subject.getLevel() != null && group.getLevel() != null
                        && !subject.getLevel().equals(group.getLevel())) {
                    continue;
                }

                for (int i = 0; i < sessionsPerWeek; i++) {
                    lessons.add(new Lesson(idGen.getAndIncrement(), subject, assignedProf, group));
                }
            }
        }
        return lessons;
    }

    private SolverFactory<TimeTable> buildSolverFactory(int solveSeconds) {
        SolverConfig config = new SolverConfig()
                .withSolutionClass(TimeTable.class)
                .withEntityClasses(Lesson.class)
                .withConstraintProviderClass(TimeTableConstraintProvider.class)
                .withTerminationConfig(new TerminationConfig()
                        .withSecondsSpentLimit((long) solveSeconds));
        return SolverFactory.create(config);
    }

    private Schedule persistSolution(TimeTable solution, Department dept, String semester,
                                      String academicYear, HardSoftScore score,
                                      long durationMs, User createdBy) {
        // Create or update schedule record
        Schedule schedule = Schedule.builder()
                .department(dept)
                .semester(semester)
                .academicYear(academicYear)
                .status(ScheduleStatus.GENERATED)
                .hardScore(score.hardScore())
                .softScore(score.softScore())
                .solveDurationMs(durationMs)
                .createdBy(createdBy)
                .build();
        schedule = scheduleRepository.save(schedule);

        // Persist all assigned sessions
        List<ScheduleSession> sessions = new ArrayList<>();
        for (Lesson lesson : solution.getLessons()) {
            if (lesson.getTimeSlot() == null || lesson.getClassroom() == null) {
                log.warn("Lesson {} has no assignment - skipping", lesson.getId());
                continue;
            }
            sessions.add(ScheduleSession.builder()
                    .schedule(schedule)
                    .subject(lesson.getSubject())
                    .professor(lesson.getProfessor())
                    .classroom(lesson.getClassroom())
                    .studentGroup(lesson.getStudentGroup())
                    .timeSlot(lesson.getTimeSlot())
                    .build());
        }
        sessionRepository.saveAll(sessions);
        schedule.setSessions(sessions);
        return schedule;
    }
}
