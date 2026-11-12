package com.girish.common.logging;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RedactionPatternConverterTest {

    @Test
    @DisplayName("Redacts plaintext passwords and tokens")
    void shouldRedactPasswordsAndTokens() {
        String logMessage = "Authentication attempt with password=SuperSecretPassword123 and token: my_secret_token_abc";
        String sanitized = RedactionPatternConverter.maskSensitiveData(logMessage);

        assertThat(sanitized).contains("password=[REDACTED]");
        assertThat(sanitized).contains("token=[REDACTED]");
        assertThat(sanitized).doesNotContain("SuperSecretPassword123");
        assertThat(sanitized).doesNotContain("my_secret_token_abc");
    }

    @Test
    @DisplayName("Redacts Bearer authorization tokens")
    void shouldRedactBearerTokens() {
        String logMessage = "Request with header Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.sig";
        String sanitized = RedactionPatternConverter.maskSensitiveData(logMessage);

        assertThat(sanitized).contains("Bearer [REDACTED]");
        assertThat(sanitized).doesNotContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    }

    @Test
    @DisplayName("Redacts email addresses to prevent PII exposure in logs")
    void shouldRedactEmails() {
        String logMessage = "Failed password reset requested for user girish.dev@gmail.com on host 127.0.0.1";
        String sanitized = RedactionPatternConverter.maskSensitiveData(logMessage);

        assertThat(sanitized).contains("[REDACTED_EMAIL]");
        assertThat(sanitized).doesNotContain("girish.dev@gmail.com");
    }

    @Test
    @DisplayName("Redacts session cookies from logs")
    void shouldRedactSessionCookies() {
        String logMessage = "Incoming Cookie header: __Host-session=a1b2c3d4e5f6g7h8; JSESSIONID=99887766";
        String sanitized = RedactionPatternConverter.maskSensitiveData(logMessage);

        assertThat(sanitized).contains("__Host-session=[REDACTED]");
        assertThat(sanitized).contains("JSESSIONID=[REDACTED]");
        assertThat(sanitized).doesNotContain("a1b2c3d4e5f6g7h8");
        assertThat(sanitized).doesNotContain("99887766");
    }

    @Test
    @DisplayName("Leaves non-sensitive logs unmodified")
    void shouldLeaveBenignLogsUnmodified() {
        String logMessage = "Module registry loaded 6 core modules successfully in 120ms";
        String sanitized = RedactionPatternConverter.maskSensitiveData(logMessage);

        assertThat(sanitized).isEqualTo(logMessage);
    }
}
