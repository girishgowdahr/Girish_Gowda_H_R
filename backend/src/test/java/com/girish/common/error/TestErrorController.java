package com.girish.common.error;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-errors")
public class TestErrorController {

    @GetMapping("/not-found")
    public void throwNotFound() {
        throw new ResourceNotFoundException("Test entity with ID 123 was not found");
    }

    @PostMapping("/validation")
    public void throwValidation(@Valid @RequestBody TestRequest request) {
        // Intentionally empty
    }

    @GetMapping("/internal")
    public void throwInternal() {
        throw new RuntimeException("Sensitive database connection details or stack trace");
    }

    public record TestRequest(
            @NotBlank(message = "Field 'name' is required and cannot be blank")
            String name
    ) {}
}
