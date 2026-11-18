package com.girish.personal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.personal.api.PrivatePersonalBioController;
import com.girish.personal.infra.PersonalBioRepository;
import com.girish.security.application.MasterPasswordAuthService;
import com.girish.security.infra.AuthCredentialRepository;
import com.girish.security.infra.SessionAuthenticationFilter;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PrivatePersonalBioIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MasterPasswordAuthService authService;

    @Autowired
    private AuthCredentialRepository authCredentialRepository;

    @Autowired
    private PersonalBioRepository personalBioRepository;

    private Cookie sessionCookie;

    @BeforeEach
    void setUp() throws Exception {
        personalBioRepository.deleteAll();
        authCredentialRepository.deleteAll();

        // Perform setup to obtain authenticated cookie
        String payload = objectMapper.writeValueAsString(Map.of("password", "GirishMaster2026!"));
        MvcResult setupRes = mockMvc.perform(post("/api/v1/auth/setup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        sessionCookie = setupRes.getResponse().getCookie(SessionAuthenticationFilter.SESSION_COOKIE_NAME);
        assertThat(sessionCookie).isNotNull();
    }

    @Test
    @DisplayName("GET /api/v1/private/personal-bio returns all 6 categories A-F initialized")
    void shouldReturnAllCategories() throws Exception {
        mockMvc.perform(get("/api/v1/private/personal-bio").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.categories.BASIC").exists())
                .andExpect(jsonPath("$.categories.CONTACT").exists())
                .andExpect(jsonPath("$.categories.EDUCATION").exists())
                .andExpect(jsonPath("$.categories.PROFESSIONAL").exists())
                .andExpect(jsonPath("$.categories.INTERESTS").exists())
                .andExpect(jsonPath("$.categories.RECORDS").exists());
    }

    @Test
    @DisplayName("PUT /api/v1/private/personal-bio/batch updates fields persistently")
    void shouldUpdateBioFields() throws Exception {
        // Initialize default template
        mockMvc.perform(get("/api/v1/private/personal-bio").cookie(sessionCookie))
                .andExpect(status().isOk());

        var updateItem = new PrivatePersonalBioController.BioFieldUpdateDto(
                "BASIC", "fullName", "Full Name", "Girish Gowda H R", "text", false, 1
        );

        mockMvc.perform(put("/api/v1/private/personal-bio/batch")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(updateItem))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.updatedCount").value(1));

        // Search bio
        mockMvc.perform(get("/api/v1/private/personal-bio/search?q=Girish").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.results[0].fieldValue").value("Girish Gowda H R"));
    }

    @Test
    @DisplayName("POST /api/v1/private/personal-bio/custom-field adds a custom field")
    void shouldAddCustomField() throws Exception {
        var customField = new PrivatePersonalBioController.CustomFieldDto(
                "BASIC", "Passport Number", "Z1234567", "text"
        );

        mockMvc.perform(post("/api/v1/private/personal-bio/custom-field")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customField)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.field.fieldLabel").value("Passport Number"))
                .andExpect(jsonPath("$.field.custom").value(true));
    }
}
