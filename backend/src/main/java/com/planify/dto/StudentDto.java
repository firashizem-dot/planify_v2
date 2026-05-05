package com.planify.dto;

import lombok.Data;

@Data
public class StudentDto {
    private Long id;
    private Long userId;
    // Fields for inline user creation (only required when userId is null)
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    // Group assignment
    private Long studentGroupId;
    private String studentGroupName;
    private String groupLevel;
}
