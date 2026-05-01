package com.planify.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class TwoFactorSetupResponse {
    private String secret;
    private String otpAuthUri;
}
