package com.girish.common.error;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final MediaType PROBLEM_JSON_MEDIA_TYPE = MediaType.parseMediaType("application/problem+json");

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetailResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        log.warn("Resource not found at {}: {}", request.getRequestURI(), ex.getMessage());
        ProblemDetailResponse response = ProblemDetailResponse.of(
                URI.create("urn:girish:error:not-found"),
                "Resource Not Found",
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                URI.create(request.getRequestURI())
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(PROBLEM_JSON_MEDIA_TYPE)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetailResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        List<ProblemDetailResponse.ValidationError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> new ProblemDetailResponse.ValidationError(err.getField(), err.getDefaultMessage()))
                .toList();

        ProblemDetailResponse response = ProblemDetailResponse.withValidationErrors(
                URI.create("urn:girish:error:validation-failed"),
                "Validation Failed",
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                "One or more request parameters failed validation.",
                URI.create(request.getRequestURI()),
                errors
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .contentType(PROBLEM_JSON_MEDIA_TYPE)
                .body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetailResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request
    ) {
        log.warn("Access denied at {}: {}", request.getRequestURI(), ex.getMessage());
        ProblemDetailResponse response = ProblemDetailResponse.of(
                URI.create("urn:girish:error:forbidden"),
                "Forbidden",
                HttpStatus.FORBIDDEN.value(),
                "You do not have permission to access this resource.",
                URI.create(request.getRequestURI())
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .contentType(PROBLEM_JSON_MEDIA_TYPE)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetailResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error("Unhandled exception at {}: ", request.getRequestURI(), ex);
        ProblemDetailResponse response = ProblemDetailResponse.of(
                URI.create("urn:girish:error:internal-error"),
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected internal error occurred. Please try again later.",
                URI.create(request.getRequestURI())
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(PROBLEM_JSON_MEDIA_TYPE)
                .body(response);
    }
}
