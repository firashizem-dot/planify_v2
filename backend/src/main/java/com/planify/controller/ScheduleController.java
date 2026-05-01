package com.planify.controller;

import com.planify.dto.GenerateScheduleRequest;
import com.planify.dto.ScheduleDto;
import com.planify.dto.ScheduleSessionDto;
import com.planify.repository.ProfessorRepository;
import com.planify.security.UserDetailsImpl;
import com.planify.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Schedules", description = "Timetable management and OptaPlanner generation")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ProfessorRepository professorRepository;

    @GetMapping
    @Operation(summary = "List schedules, optionally filtered by department")
    public ResponseEntity<List<ScheduleDto>> list(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) return ResponseEntity.ok(scheduleService.getSchedulesByDepartment(departmentId));
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @GetMapping("/{id}/sessions")
    @Operation(summary = "Get all sessions for a specific schedule")
    public ResponseEntity<List<ScheduleSessionDto>> getSessions(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getSessionsBySchedule(id));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate timetable using OptaPlanner solver")
    public ResponseEntity<ScheduleDto> generate(@Valid @RequestBody GenerateScheduleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleService.generateSchedule(request));
    }

    @GetMapping("/my-schedule")
    @Operation(summary = "Get the current professor's personal schedule")
    public ResponseEntity<List<ScheduleSessionDto>> mySchedule(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return professorRepository.findByUserId(userDetails.getId())
                .map(prof -> ResponseEntity.ok(scheduleService.getMyScheduleAsProfessor(prof.getId())))
                .orElse(ResponseEntity.ok(List.of()));
    }

    @GetMapping("/by-group/{groupId}")
    @Operation(summary = "Get published schedule for a student group")
    public ResponseEntity<List<ScheduleSessionDto>> byGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(scheduleService.getScheduleForGroup(groupId));
    }

    @PostMapping("/{id}/validate")
    @Operation(summary = "Validate a generated schedule")
    public ResponseEntity<ScheduleDto> validate(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.validateSchedule(id));
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "Publish a validated schedule (makes it visible to professors/students)")
    public ResponseEntity<ScheduleDto> publish(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.publishSchedule(id));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "Archive a schedule")
    public ResponseEntity<ScheduleDto> archive(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.archiveSchedule(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
