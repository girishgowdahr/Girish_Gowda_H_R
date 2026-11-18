package com.girish.security.application;

import com.girish.security.domain.AppUser;
import com.girish.security.domain.AuthCredential;
import com.girish.security.domain.UserSession;
import com.girish.security.infra.AppUserRepository;
import com.girish.security.infra.AuthCredentialRepository;
import com.girish.security.infra.UserSessionRepository;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MasterPasswordAuthService {

    public static final String MASTER_CREDENTIAL_TYPE = "MASTER_PASSWORD";
    public static final int SESSION_DURATION_MINUTES = 30;
    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final int LOCKOUT_MINUTES = 15;

    private final AppUserRepository appUserRepository;
    private final AuthCredentialRepository authCredentialRepository;
    private final UserSessionRepository userSessionRepository;
    private final Argon2PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    // In-memory rate limiting tracker: IP / client key -> AttemptState
    private final Map<String, AttemptState> loginAttempts = new ConcurrentHashMap<>();

    public MasterPasswordAuthService(AppUserRepository appUserRepository,
                                     AuthCredentialRepository authCredentialRepository,
                                     UserSessionRepository userSessionRepository) {
        this.appUserRepository = appUserRepository;
        this.authCredentialRepository = authCredentialRepository;
        this.userSessionRepository = userSessionRepository;
        this.passwordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    public boolean isSetupRequired() {
        return authCredentialRepository.findFirstByCredentialType(MASTER_CREDENTIAL_TYPE).isEmpty();
    }

    @Transactional
    public AppUser setupMasterPassword(String masterPassword) {
        if (masterPassword == null || masterPassword.trim().length() < 8) {
            throw new IllegalArgumentException("Master password must be at least 8 characters long.");
        }

        if (!isSetupRequired()) {
            throw new IllegalStateException("Master password has already been configured.");
        }

        AppUser owner = getOrCreateOwnerUser();

        String argon2Hash = passwordEncoder.encode(masterPassword.trim());
        OffsetDateTime now = OffsetDateTime.now();

        AuthCredential credential = new AuthCredential(
                UUID.randomUUID(),
                owner.getId(),
                MASTER_CREDENTIAL_TYPE,
                owner.getEmail(),
                argon2Hash,
                "{\"algorithm\":\"Argon2id\",\"version\":\"v5.8\"}",
                now,
                now
        );
        authCredentialRepository.save(credential);

        return owner;
    }

    @Transactional
    public LoginResult login(String password, String ipAddress, String userAgent) {
        String rateKey = (ipAddress != null && !ipAddress.isBlank()) ? ipAddress : "default_client";
        checkRateLimit(rateKey);

        Optional<AuthCredential> credentialOpt = authCredentialRepository.findFirstByCredentialType(MASTER_CREDENTIAL_TYPE);
        if (credentialOpt.isEmpty()) {
            throw new IllegalStateException("Master password is not yet configured. Please complete setup first.");
        }

        AuthCredential credential = credentialOpt.get();
        boolean matches = password != null && passwordEncoder.matches(password.trim(), credential.getSecretHash());

        if (!matches) {
            recordFailedAttempt(rateKey);
            int remaining = getRemainingAttempts(rateKey);
            if (remaining <= 0) {
                throw new SecurityException("Too many failed login attempts. Locked out for 15 minutes.");
            }
            throw new SecurityException("Invalid Master Password. " + remaining + " attempts remaining.");
        }

        // Reset rate limiter on successful authentication
        loginAttempts.remove(rateKey);

        AppUser user = appUserRepository.findById(credential.getUserId())
                .orElseThrow(() -> new IllegalStateException("User profile associated with credential not found."));

        // Generate high-entropy 256-bit session token
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String rawToken = HexFormat.of().formatHex(tokenBytes);
        String tokenHash = hashToken(rawToken);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expiresAt = now.plusMinutes(SESSION_DURATION_MINUTES);

        UserSession session = new UserSession(
                UUID.randomUUID(),
                user.getId(),
                tokenHash,
                ipAddress,
                userAgent,
                now,
                expiresAt,
                now
        );
        userSessionRepository.save(session);

        return new LoginResult(rawToken, user, expiresAt);
    }

    @Transactional
    public void logout(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        String tokenHash = hashToken(rawToken);
        userSessionRepository.findByTokenHash(tokenHash).ifPresent(session -> {
            session.setRevokedAt(OffsetDateTime.now());
            userSessionRepository.save(session);
        });
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword, UUID userId) {
        if (newPassword == null || newPassword.trim().length() < 8) {
            throw new IllegalArgumentException("New master password must be at least 8 characters long.");
        }

        AuthCredential credential = authCredentialRepository.findByUserIdAndCredentialType(userId, MASTER_CREDENTIAL_TYPE)
                .orElseThrow(() -> new IllegalStateException("Master password credential not found."));

        if (!passwordEncoder.matches(currentPassword.trim(), credential.getSecretHash())) {
            throw new SecurityException("Current master password verification failed.");
        }

        String newHash = passwordEncoder.encode(newPassword.trim());
        credential.setSecretHash(newHash);
        credential.setUpdatedAt(OffsetDateTime.now());
        authCredentialRepository.save(credential);

        // Revoke all existing sessions for this user for security
        userSessionRepository.findByUserId(userId).forEach(session -> {
            if (session.getRevokedAt() == null) {
                session.setRevokedAt(OffsetDateTime.now());
                userSessionRepository.save(session);
            }
        });
    }

    @Transactional
    public Optional<AppUser> validateSession(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return Optional.empty();
        }

        String tokenHash = hashToken(rawToken);
        Optional<UserSession> sessionOpt = userSessionRepository.findByTokenHash(tokenHash);

        if (sessionOpt.isEmpty()) {
            return Optional.empty();
        }

        UserSession session = sessionOpt.get();
        OffsetDateTime now = OffsetDateTime.now();

        // Check if revoked
        if (session.getRevokedAt() != null) {
            return Optional.empty();
        }

        // Check expiration
        if (session.getExpiresAt().isBefore(now)) {
            return Optional.empty();
        }

        // Sliding expiration: check inactivity
        if (session.getLastActiveAt().plusMinutes(SESSION_DURATION_MINUTES).isBefore(now)) {
            session.setRevokedAt(now);
            userSessionRepository.save(session);
            return Optional.empty();
        }

        // Update lastActiveAt and extend expiresAt
        session.setLastActiveAt(now);
        session.setExpiresAt(now.plusMinutes(SESSION_DURATION_MINUTES));
        userSessionRepository.save(session);

        return appUserRepository.findById(session.getUserId());
    }

    public AppUser getOrCreateOwnerUser() {
        return appUserRepository.findAll().stream().findFirst().orElseGet(() -> {
            OffsetDateTime now = OffsetDateTime.now();
            AppUser owner = new AppUser(
                    UUID.randomUUID(),
                    "girishgowdahr07@gmail.com",
                    "Girish Gowda H R",
                    "OWNER",
                    "ACTIVE",
                    now,
                    now
            );
            return appUserRepository.save(owner);
        });
    }

    private void checkRateLimit(String rateKey) {
        AttemptState state = loginAttempts.get(rateKey);
        if (state != null && state.lockoutUntil != null) {
            if (OffsetDateTime.now().isBefore(state.lockoutUntil)) {
                long minutesLeft = java.time.Duration.between(OffsetDateTime.now(), state.lockoutUntil).toMinutes() + 1;
                throw new SecurityException("Account temporarily locked due to repeated incorrect password attempts. Try again in " + minutesLeft + " minutes.");
            } else {
                loginAttempts.remove(rateKey);
            }
        }
    }

    private void recordFailedAttempt(String rateKey) {
        AttemptState state = loginAttempts.computeIfAbsent(rateKey, k -> new AttemptState());
        state.attempts++;
        state.lastAttempt = OffsetDateTime.now();
        if (state.attempts >= MAX_FAILED_ATTEMPTS) {
            state.lockoutUntil = OffsetDateTime.now().plusMinutes(LOCKOUT_MINUTES);
        }
    }

    private int getRemainingAttempts(String rateKey) {
        AttemptState state = loginAttempts.get(rateKey);
        if (state == null) {
            return MAX_FAILED_ATTEMPTS;
        }
        return Math.max(0, MAX_FAILED_ATTEMPTS - state.attempts);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 digest unavailable", e);
        }
    }

    public record LoginResult(String rawToken, AppUser user, OffsetDateTime expiresAt) {}

    private static class AttemptState {
        int attempts = 0;
        OffsetDateTime lastAttempt;
        OffsetDateTime lockoutUntil;
    }
}
