package com.planify.controller;

import com.planify.dto.TimeSlotDto;
import com.planify.service.TimeSlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Time Slots", description = "Time slot management")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<List<TimeSlotDto>> list(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) return ResponseEntity.ok(timeSlotService.getTimeSlotsByDepartment(departmentId));
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlotDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(timeSlotService.getTimeSlotById(id));
    }

    @PostMapping
    public ResponseEntity<TimeSlotDto> create(@Valid @RequestBody TimeSlotDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(timeSlotService.createTimeSlot(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSlotDto> update(@PathVariable Long id, @Valid @RequestBody TimeSlotDto dto) {
        return ResponseEntity.ok(timeSlotService.updateTimeSlot(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.noContent().build();
    }
}
