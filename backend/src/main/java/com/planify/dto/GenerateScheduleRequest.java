package com.planify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenerateScheduleRequest {
    @NotNull
    private Long departmentId;
    @NotBlank
    private String semester;
    @NotBlank
    private String academicYear;
    private Integer solveSeconds = 30;
    private String level;
}
