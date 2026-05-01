package com.planify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentGroupDto {
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    @NotNull
    private Long departmentId;
    private String departmentName;
    private String level;
    private Integer studentCount;
}
