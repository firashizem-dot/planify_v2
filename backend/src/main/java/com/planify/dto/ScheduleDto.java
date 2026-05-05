package com.planify.dto;

import com.planify.model.enums.ScheduleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleDto {
    private Long id;
    @NotNull
    private Long departmentId;
    private String departmentName;
    @NotBlank
    private String semester;
    @NotBlank
    private String academicYear;
    private ScheduleStatus status;
    private Integer hardScore;
    private Integer softScore;
    private Long solveDurationMs;
    private String constraintViolations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
