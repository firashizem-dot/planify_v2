package com.planify.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TwoFactorVerifyRequest {
    @NotBlank
    private String email;
    @NotNull
    private Integer code;
}
