package com.planify.dto;

import com.planify.model.enums.ClassroomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassroomDto {
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    @NotNull
    private ClassroomType type;
    @NotNull @Min(1)
    private Integer capacity;
    private Long departmentId;
    private String departmentName;
    private String equipment;
}
