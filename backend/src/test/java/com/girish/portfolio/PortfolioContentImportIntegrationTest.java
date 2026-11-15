package com.girish.portfolio;

import com.girish.portfolio.application.PortfolioContentImportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PortfolioContentImportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PortfolioContentImportService importService;

    @Test
    @DisplayName("8a: Public API returns exactly the PUBLISHED records from the confirmed file")
    void shouldReturnPublishedRecordsFromFile() throws Exception {
        mockMvc.perform(get("/api/v1/public/portfolio")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.fullName", equalTo("Girish Gowda H R")))
                .andExpect(jsonPath("$.profile.headline", equalTo("Software Engineer | Java, SQL & Full-Stack Development")))
                .andExpect(jsonPath("$.profile.location", equalTo("Bengaluru, Karnataka")))
                .andExpect(jsonPath("$.skillCategories", hasSize(7)))
                .andExpect(jsonPath("$.featuredProjects", hasSize(2)))
                .andExpect(jsonPath("$.education", hasSize(4)))
                .andExpect(jsonPath("$.certificates", hasSize(1)))
                .andExpect(jsonPath("$.publications", hasSize(1)))
                .andExpect(jsonPath("$.experience", hasSize(0)));
    }

    @Test
    @DisplayName("8b: No DRAFT or UNCONFIRMED record appears in any public response")
    void shouldNotExposeDraftOrUnconfirmedRecords() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/public/portfolio")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();

        // College email was marked DRAFT with note: must not be in public payload
        assertThat(content).doesNotContain("girishgowdahr.mca25@rvce.edu.in");
        // LinkedIn and GitHub were UNCONFIRMED with null values: must not expose synthetic placeholders
        assertThat(content).doesNotContain("placeholder-owner");
    }

    @Test
    @DisplayName("8c: No string 'SYNTHETIC' or 'lorem' reaches any public endpoint")
    void shouldNeverContainSyntheticOrLoremInPublicEndpoints() throws Exception {
        String[] endpoints = {
                "/api/v1/public/portfolio",
                "/api/v1/public/portfolio/profile",
                "/api/v1/public/portfolio/skills",
                "/api/v1/public/portfolio/projects",
                "/api/v1/public/portfolio/education",
                "/api/v1/public/portfolio/certificates",
                "/api/v1/public/portfolio/publications",
                "/api/v1/public/portfolio/experience",
                "/api/v1/public/portfolio/resume"
        };

        for (String endpoint : endpoints) {
            MvcResult result = mockMvc.perform(get(endpoint)).andReturn();
            String body = result.getResponse().getContentAsString();
            assertThat(body.toLowerCase())
                    .as("Endpoint %s must not contain 'synthetic'", endpoint)
                    .doesNotContain("synthetic");
            assertThat(body.toLowerCase())
                    .as("Endpoint %s must not contain 'lorem'", endpoint)
                    .doesNotContain("lorem");
        }
    }

    @Test
    @DisplayName("8d: Re-running the import changes nothing (Idempotency)")
    void shouldBeIdempotentOnRepeatedImports() throws Exception {
        // First get current summary
        MvcResult firstResult = mockMvc.perform(get("/api/v1/public/portfolio")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        String firstContent = firstResult.getResponse().getContentAsString();

        // Re-run the import from the classpath resource
        try (InputStream is = getClass().getResourceAsStream("/content/girish-content.json")) {
            assertThat(is).isNotNull();
            importService.importContent(is);
        }

        // Get second summary
        MvcResult secondResult = mockMvc.perform(get("/api/v1/public/portfolio")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        String secondContent = secondResult.getResponse().getContentAsString();

        // Must be identical
        assertThat(secondContent).isEqualTo(firstContent);
    }
}
