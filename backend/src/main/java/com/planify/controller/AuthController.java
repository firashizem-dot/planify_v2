package com.planify.controller;

import com.planify.dto.auth.*;
import com.planify.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, logout, and 2FA management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/2fa/verify")
    @Operation(summary = "Verify TOTP code and get JWT token")
    public ResponseEntity<LoginResponse> verify2FA(@Valid @RequestBody TwoFactorVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyTwoFactor(request));
    }

    @PostMapping("/2fa/setup")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Initiate 2FA setup - returns secret and QR code URI")
    public ResponseEntity<TwoFactorSetupResponse> setup2FA(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.setupTwoFactor(userDetails.getUsername()));
    }

    @PostMapping("/2fa/enable")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Enable 2FA after verifying the code")
    public ResponseEntity<Map<String, String>> enable2FA(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestBody Map<String, Integer> body) {
        authService.enableTwoFactor(userDetails.getUsername(), body.get("code"));
        return ResponseEntity.ok(Map.of("message", "2FA enabled successfully"));
    }

    @PostMapping("/2fa/disable")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Disable 2FA for the current user")
    public ResponseEntity<Map<String, String>> disable2FA(@AuthenticationPrincipal UserDetails userDetails) {
        authService.disableTwoFactor(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "2FA disabled"));
    }
}
