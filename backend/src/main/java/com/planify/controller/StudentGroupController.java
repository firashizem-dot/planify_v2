package com.planify.controller;

import com.planify.dto.StudentGroupDto;
import com.planify.service.StudentGroupService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Student Groups", description = "Student group management")
public class StudentGroupController {

    private final StudentGroupService groupService;

    @GetMapping
    public ResponseEntity<List<StudentGroupDto>> list(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) return ResponseEntity.ok(groupService.getGroupsByDepartment(departmentId));
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentGroupDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PostMapping
    public ResponseEntity<StudentGroupDto> create(@Valid @RequestBody StudentGroupDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.createGroup(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentGroupDto> update(@PathVariable Long id, @Valid @RequestBody StudentGroupDto dto) {
        return ResponseEntity.ok(groupService.updateGroup(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}
