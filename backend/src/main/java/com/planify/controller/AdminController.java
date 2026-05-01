package com.planify.controller;

import com.planify.dto.DepartmentDto;
import com.planify.dto.UserDto;
import com.planify.model.enums.UserRole;
import com.planify.service.DepartmentService;
import com.planify.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Administration", description = "Admin-only operations")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final DepartmentService departmentService;

    // --- Department Head Management ---

    @GetMapping("/department-heads")
    @Operation(summary = "List all department heads")
    public ResponseEntity<List<UserDto>> listDepartmentHeads() {
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.DEPARTMENT_HEAD));
    }

    @PostMapping("/department-heads")
    @Operation(summary = "Create a department head account")
    public ResponseEntity<UserDto> createDepartmentHead(@Valid @RequestBody UserDto dto) {
        dto.setRole(UserRole.DEPARTMENT_HEAD);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(dto));
    }

    @PutMapping("/department-heads/{id}")
    @Operation(summary = "Update a department head account")
    public ResponseEntity<UserDto> updateDepartmentHead(@PathVariable Long id, @Valid @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @DeleteMapping("/department-heads/{id}")
    @Operation(summary = "Delete a department head account")
    public ResponseEntity<Void> deleteDepartmentHead(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // --- Department Management ---

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> listDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(dto));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentDto dto) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, dto));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    // --- All users overview ---

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> listAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
