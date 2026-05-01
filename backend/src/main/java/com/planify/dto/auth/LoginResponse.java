package com.planify.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @Builder @AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private Long departmentId;
    private boolean twoFactorRequired;
    private boolean twoFactorEnabled;
}
