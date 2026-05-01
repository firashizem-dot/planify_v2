package com.planify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String code;
    private String description;
    private Long headId;
    private String headName;
}
