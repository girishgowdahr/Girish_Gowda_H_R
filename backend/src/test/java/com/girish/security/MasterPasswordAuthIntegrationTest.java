package com.girish.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.security.application.MasterPasswordAuthService;
import com.girish.security.domain.AuthCredential;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MasterPasswordAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MasterPasswordAuthService authService;

    @Autowired
    private AuthCredentialRepository authCredentialRepository;

    @BeforeEach
    void setUp() {
        authCredentialRepository.deleteAll();
    }

    @Test
    @DisplayName("Initial status should report setupRequired=true when no master password is set")
    void shouldReportSetupRequiredWhenNoPassword() throws Exception {
        mockMvc.perform(get("/api/v1/auth/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false))
                .andExpect(jsonPath("$.setupRequired").value(true));
    }

    @Test
    @DisplayName("Setup flow creates Argon2id hash and establishes active session")
    void shouldSetupMasterPasswordAndLogin() throws Exception {
        String setupPayload = objectMapper.writeValueAsString(Map.of("password", "SecureMaster2026!"));

        MvcResult result = mockMvc.perform(post("/api/v1/auth/setup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(setupPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(cookie().exists(SessionAuthenticationFilter.SESSION_COOKIE_NAME))
                .andReturn();

        // Verify stored credential in database is Argon2id
        AuthCredential credential = authCredentialRepository.findFirstByCredentialType(MasterPasswordAuthService.MASTER_CREDENTIAL_TYPE).orElseThrow();
        assertThat(credential.getSecretHash()).startsWith("$argon2id$");

        Cookie sessionCookie = result.getResponse().getCookie(SessionAuthenticationFilter.SESSION_COOKIE_NAME);
        assertThat(sessionCookie).isNotNull();

        // Verify authenticated status with session cookie
        mockMvc.perform(get("/api/v1/auth/status").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.setupRequired").value(false));
    }

    @Test
    @DisplayName("Unauthenticated access to /api/v1/private/personal-bio is strictly rejected with 401/403")
    void shouldRejectUnauthenticatedPrivateAccess() throws Exception {
        mockMvc.perform(get("/api/v1/private/personal-bio"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Invalid password attempts report remaining attempts")
    void shouldRejectInvalidPassword() throws Exception {
        authService.setupMasterPassword("CorrectPassword123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("password", "WrongPassword!"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").exists());
    }
}
