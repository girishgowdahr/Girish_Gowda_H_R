package com.girish.common.logging;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.pattern.CompositeConverter;

import java.util.regex.Pattern;

public class RedactionPatternConverter extends CompositeConverter<ILoggingEvent> {

    private static final Pattern BEARER_HEADER_PATTERN = Pattern.compile(
            "(?i)(?:authorization[\\s]*:[\\s]*)?bearer\\s+[a-zA-Z0-9_\\-\\.]+"
    );

    private static final Pattern SENSITIVE_KV_PATTERN = Pattern.compile(
            "(?i)(password|token|secret|apiKey|access_key|secret_key)[\\s]*[=:]+[\\s]*['\"]?([^'\"\\s,;]+)['\"]?"
    );

    private static final Pattern SESSION_COOKIE_PATTERN = Pattern.compile(
            "(?i)(__Host-[a-zA-Z0-9_-]+|JSESSIONID)=[^\";\\s]+"
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "(?i)[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}"
    );

    @Override
    protected String transform(ILoggingEvent event, String in) {
        if (in == null || in.isEmpty()) {
            return in;
        }
        return maskSensitiveData(in);
    }

    public static String maskSensitiveData(String input) {
        if (input == null) return null;

        String redacted = BEARER_HEADER_PATTERN.matcher(input).replaceAll("Authorization: Bearer [REDACTED]");
        redacted = SENSITIVE_KV_PATTERN.matcher(redacted).replaceAll("$1=[REDACTED]");
        redacted = SESSION_COOKIE_PATTERN.matcher(redacted).replaceAll("$1=[REDACTED]");
        redacted = EMAIL_PATTERN.matcher(redacted).replaceAll("[REDACTED_EMAIL]");
        return redacted;
    }
}

