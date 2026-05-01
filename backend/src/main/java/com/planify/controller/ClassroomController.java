package com.planify.controller;

import com.planify.dto.ClassroomDto;
import com.planify.service.ClassroomService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Classrooms", description = "Classroom and laboratory management")
public class ClassroomController {

    private final ClassroomService classroomService;

    @GetMapping
    public ResponseEntity<List<ClassroomDto>> list() {
        return ResponseEntity.ok(classroomService.getAllClassrooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getClassroomById(id));
    }

    @PostMapping
    public ResponseEntity<ClassroomDto> create(@Valid @RequestBody ClassroomDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classroomService.createClassroom(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassroomDto> update(@PathVariable Long id, @Valid @RequestBody ClassroomDto dto) {
        return ResponseEntity.ok(classroomService.updateClassroom(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.noContent().build();
    }
}
