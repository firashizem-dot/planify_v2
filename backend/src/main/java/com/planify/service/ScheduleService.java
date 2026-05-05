package com.planify.service;

import com.planify.dto.GenerateScheduleRequest;
import com.planify.dto.ScheduleDto;
import com.planify.dto.ScheduleSessionDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Schedule;
import com.planify.model.ScheduleSession;
import com.planify.model.User;
import com.planify.model.enums.ScheduleStatus;
import com.planify.optaplanner.service.TimetableSolverService;
import com.planify.repository.*;
import com.planify.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ScheduleSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final TimetableSolverService solverService;

    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<ScheduleDto> getSchedulesByDepartment(Long deptId) {
        return scheduleRepository.findByDepartmentId(deptId).stream().map(this::toDto).toList();
    }

    public ScheduleDto getScheduleById(Long id) {
        return toDto(scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id)));
    }

    public List<ScheduleSessionDto> getSessionsBySchedule(Long scheduleId) {
        return sessionRepository.findByScheduleId(scheduleId)
                .stream().map(this::sessionToDto).toList();
    }

    /** Triggers OptaPlanner to generate a new schedule. */
    @Transactional
    public ScheduleDto generateSchedule(GenerateScheduleRequest request) {
        User currentUser = getCurrentUser();
        Schedule schedule = solverService.generateSchedule(request, currentUser);
        return toDto(schedule);
    }

    /** Returns sessions for the currently authenticated professor. */
    public List<ScheduleSessionDto> getMyScheduleAsProfessor(Long professorId) {
        return sessionRepository.findPublishedSessionsByProfessor(professorId)
                .stream().map(this::sessionToDto).toList();
    }

    /** Returns sessions for a specific student group. */
    public List<ScheduleSessionDto> getScheduleForGroup(Long groupId) {
        return sessionRepository.findPublishedSessionsByGroup(groupId)
                .stream().map(this::sessionToDto).toList();
    }

    @Transactional
    public ScheduleDto validateSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));
        if (schedule.getStatus() != ScheduleStatus.GENERATED)
            throw new BadRequestException("Only GENERATED schedules can be validated");
        schedule.setStatus(ScheduleStatus.VALIDATED);
        return toDto(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleDto publishSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));
        if (schedule.getStatus() != ScheduleStatus.VALIDATED)
            throw new BadRequestException("Only VALIDATED schedules can be published");
        schedule.setStatus(ScheduleStatus.PUBLISHED);
        return toDto(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleDto archiveSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));
        schedule.setStatus(ScheduleStatus.ARCHIVED);
        return toDto(scheduleRepository.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) throw new ResourceNotFoundException("Schedule", id);
        scheduleRepository.deleteById(id);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", userDetails.getId()));
    }

    public ScheduleDto toDto(Schedule schedule) {
        ScheduleDto dto = new ScheduleDto();
        dto.setId(schedule.getId());
        dto.setDepartmentId(schedule.getDepartment().getId());
        dto.setDepartmentName(schedule.getDepartment().getName());
        dto.setSemester(schedule.getSemester());
        dto.setAcademicYear(schedule.getAcademicYear());
        dto.setStatus(schedule.getStatus());
        dto.setHardScore(schedule.getHardScore());
        dto.setSoftScore(schedule.getSoftScore());
        dto.setSolveDurationMs(schedule.getSolveDurationMs());
        dto.setConstraintViolations(schedule.getConstraintViolations());
        dto.setCreatedAt(schedule.getCreatedAt());
        dto.setUpdatedAt(schedule.getUpdatedAt());
        return dto;
    }

    public ScheduleSessionDto sessionToDto(ScheduleSession s) {
        ScheduleSessionDto dto = new ScheduleSessionDto();
        dto.setId(s.getId());
        dto.setScheduleId(s.getSchedule().getId());
        dto.setSubjectId(s.getSubject().getId());
        dto.setSubjectName(s.getSubject().getName());
        dto.setSubjectCode(s.getSubject().getCode());
        dto.setCourseType(s.getSubject().getCourseType());
        dto.setProfessorId(s.getProfessor().getId());
        dto.setProfessorName(s.getProfessor().getUser().getFullName());
        dto.setClassroomId(s.getClassroom().getId());
        dto.setClassroomName(s.getClassroom().getName());
        dto.setClassroomCode(s.getClassroom().getCode());
        dto.setStudentGroupId(s.getStudentGroup().getId());
        dto.setStudentGroupName(s.getStudentGroup().getName());
        dto.setTimeSlotId(s.getTimeSlot().getId());
        dto.setDayOfWeek(s.getTimeSlot().getDayOfWeek());
        dto.setStartTime(s.getTimeSlot().getStartTime());
        dto.setEndTime(s.getTimeSlot().getEndTime());
        return dto;
    }
}
