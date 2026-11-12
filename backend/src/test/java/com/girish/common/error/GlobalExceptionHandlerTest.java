package com.girish.common.error;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    @DisplayName("ResourceNotFoundException returns 404 application/problem+json")
    void shouldReturn404ProblemJsonOnNotFound() throws Exception {
        mockMvc.perform(get("/api/test-errors/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/problem+json"))
                .andExpect(jsonPath("$.type").value("urn:girish:error:not-found"))
                .andExpect(jsonPath("$.title").value("Resource Not Found"))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Test entity with ID 123 was not found"))
                .andExpect(jsonPath("$.instance").value("/api/test-errors/not-found"))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @WithMockUser
    @DisplayName("MethodArgumentNotValidException returns 422 application/problem+json with field errors")
    void shouldReturn422ProblemJsonOnValidationFailure() throws Exception {
        mockMvc.perform(post("/api/test-errors/validation")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"\"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(content().contentType("application/problem+json"))
                .andExpect(jsonPath("$.type").value("urn:girish:error:validation-failed"))
                .andExpect(jsonPath("$.title").value("Validation Failed"))
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.invalidParameters", hasSize(1)))
                .andExpect(jsonPath("$.invalidParameters[0].field").value("name"))
                .andExpect(jsonPath("$.invalidParameters[0].reason").value("Field 'name' is required and cannot be blank"));
    }

    @Test
    @WithMockUser
    @DisplayName("Unhandled Exception returns 500 application/problem+json without leaking sensitive details")
    void shouldReturn500ProblemJsonWithoutStacktraceLeak() throws Exception {
        mockMvc.perform(get("/api/test-errors/internal"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType("application/problem+json"))
                .andExpect(jsonPath("$.type").value("urn:girish:error:internal-error"))
                .andExpect(jsonPath("$.title").value("Internal Server Error"))
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.detail").value("An unexpected internal error occurred. Please try again later."))
                .andExpect(jsonPath("$.detail", not(containsString("Sensitive database connection details"))));
    }
}
