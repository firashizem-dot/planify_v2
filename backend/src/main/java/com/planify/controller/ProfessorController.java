package com.planify.controller;

import com.planify.dto.ProfessorDto;
import com.planify.dto.ProfessorPreferenceDto;
import com.planify.service.ProfessorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Professors", description = "Professor management")
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping
    @Operation(summary = "List all professors (optionally filter by department)")
    public ResponseEntity<List<ProfessorDto>> list(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) return ResponseEntity.ok(professorService.getProfessorsByDepartment(departmentId));
        return ResponseEntity.ok(professorService.getAllProfessors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.getProfessorById(id));
    }

    @PostMapping
    public ResponseEntity<ProfessorDto> create(@Valid @RequestBody ProfessorDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professorService.createProfessor(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDto> update(@PathVariable Long id, @RequestBody ProfessorDto dto) {
        return ResponseEntity.ok(professorService.updateProfessor(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/preferences")
    @Operation(summary = "Get professor timeslot preferences (avoided slots)")
    public ResponseEntity<List<ProfessorPreferenceDto>> getPreferences(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.getPreferences(id));
    }

    @PostMapping("/{id}/preferences/{timeSlotId}")
    @Operation(summary = "Add an avoided timeslot preference for a professor")
    public ResponseEntity<ProfessorPreferenceDto> addPreference(@PathVariable Long id,
                                                                 @PathVariable Long timeSlotId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professorService.addPreference(id, timeSlotId));
    }

    @DeleteMapping("/{id}/preferences/{timeSlotId}")
    @Operation(summary = "Remove an avoided timeslot preference for a professor")
    public ResponseEntity<Void> removePreference(@PathVariable Long id,
                                                  @PathVariable Long timeSlotId) {
        professorService.removePreference(id, timeSlotId);
        return ResponseEntity.noContent().build();
    }
}
