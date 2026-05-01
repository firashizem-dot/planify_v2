package com.planify.service;

import com.planify.dto.auth.*;
import com.planify.exception.BadRequestException;
import com.planify.exception.UnauthorizedException;
import com.planify.model.User;
import com.planify.repository.UserRepository;
import com.planify.security.JwtTokenProvider;
import com.planify.security.TotpService;
import com.planify.security.UserDetailsImpl;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final TotpService totpService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        // If 2FA is enabled, return a flag indicating 2FA is required (no token yet)
        if (user.isTwoFactorEnabled()) {
            return LoginResponse.builder()
                    .email(user.getEmail())
                    .twoFactorRequired(true)
                    .twoFactorEnabled(true)
                    .build();
        }

        String token = tokenProvider.generateToken(auth);
        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .twoFactorRequired(false)
                .twoFactorEnabled(false)
                .build();
    }

    @Transactional
    public LoginResponse verifyTwoFactor(TwoFactorVerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            throw new BadRequestException("2FA is not enabled for this user");
        }

        if (!totpService.verifyCode(user.getTwoFactorSecret(), request.getCode())) {
            throw new UnauthorizedException("Invalid 2FA code");
        }

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());
        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .twoFactorRequired(false)
                .twoFactorEnabled(true)
                .build();
    }

    @Transactional
    public TwoFactorSetupResponse setupTwoFactor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        GoogleAuthenticatorKey key = totpService.generateKey();
        user.setTwoFactorSecret(key.getKey());
        userRepository.save(user);

        String uri = totpService.getOtpAuthUri(email, key);
        return new TwoFactorSetupResponse(key.getKey(), uri);
    }

    @Transactional
    public void enableTwoFactor(String email, int code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getTwoFactorSecret() == null) {
            throw new BadRequestException("2FA setup not initiated. Call /api/auth/2fa/setup first");
        }

        if (!totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            throw new UnauthorizedException("Invalid 2FA code");
        }

        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void disableTwoFactor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
    }
}
