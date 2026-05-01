package com.planify.controller;

import com.planify.dto.SubjectDto;
import com.planify.service.SubjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Subjects", description = "Subject/course management")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectDto>> list(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) return ResponseEntity.ok(subjectService.getSubjectsByDepartment(departmentId));
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PostMapping
    public ResponseEntity<SubjectDto> create(@Valid @RequestBody SubjectDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.createSubject(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectDto> update(@PathVariable Long id, @Valid @RequestBody SubjectDto dto) {
        return ResponseEntity.ok(subjectService.updateSubject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
