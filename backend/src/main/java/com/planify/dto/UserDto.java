package com.planify.dto;

import com.planify.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    @NotBlank @Email
    private String email;
    private String password; // Only used on create
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    private UserRole role;
    private Long departmentId;
    private String departmentName;
    private boolean enabled;
    private boolean twoFactorEnabled;
}
