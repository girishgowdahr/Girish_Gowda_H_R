package com.girish.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.net.URI;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProblemDetailResponse(
        URI type,
        String title,
        int status,
        String detail,
        URI instance,
        Instant timestamp,
        List<ValidationError> invalidParameters
) {
    public static ProblemDetailResponse of(URI type, String title, int status, String detail, URI instance) {
        return new ProblemDetailResponse(type, title, status, detail, instance, Instant.now(), null);
    }

    public static ProblemDetailResponse withValidationErrors(
            URI type,
            String title,
            int status,
            String detail,
            URI instance,
            List<ValidationError> invalidParameters
    ) {
        return new ProblemDetailResponse(type, title, status, detail, instance, Instant.now(), invalidParameters);
    }

    public record ValidationError(String field, String reason) {}
}
