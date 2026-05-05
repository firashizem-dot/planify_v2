package com.planify.dto;

import com.planify.model.enums.CourseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubjectDto {
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    @NotNull
    private Long departmentId;
    private String departmentName;
    @NotNull
    private CourseType courseType;
    @NotNull
    private BigDecimal hoursPerWeek;
    private String level;
    private String semester;
    private String description;
}
