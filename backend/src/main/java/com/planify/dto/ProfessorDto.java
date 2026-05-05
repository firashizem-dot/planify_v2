package com.planify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class ProfessorDto {
    private Long id;
    private Long userId;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    @NotNull
    private Long departmentId;
    private String departmentName;
    private String specialization;
    private Integer maxHoursPerWeek;
    private Set<Long> subjectIds;
    private Set<String> subjectNames;
}
