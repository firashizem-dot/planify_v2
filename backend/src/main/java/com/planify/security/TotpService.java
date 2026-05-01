package com.planify.security;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TotpService {

    private final GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

    /** Generates a new TOTP secret key for a user. */
    public GoogleAuthenticatorKey generateKey() {
        return googleAuthenticator.createCredentials();
    }

    /** Returns the OTP Auth URI used by authenticator apps (scanned as QR code). */
    public String getOtpAuthUri(String email, GoogleAuthenticatorKey key) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL("Planify", email, key);
    }

    /** Validates a TOTP code against the stored secret. */
    public boolean verifyCode(String secret, int code) {
        try {
            return googleAuthenticator.authorize(secret, code);
        } catch (Exception e) {
            log.warn("TOTP verification failed: {}", e.getMessage());
            return false;
        }
    }
}
