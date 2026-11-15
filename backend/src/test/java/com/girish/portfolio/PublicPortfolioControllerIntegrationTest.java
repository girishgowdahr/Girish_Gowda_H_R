package com.girish.portfolio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PublicPortfolioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/public/portfolio returns 200 and complete portfolio summary")
    void shouldReturnPortfolioSummary() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/public/portfolio")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.ETAG))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, containsString("public")))
                .andExpect(jsonPath("$.profile.fullName", equalTo("Girish Gowda H R")))
                .andExpect(jsonPath("$.skillCategories", hasSize(7)))
                .andExpect(jsonPath("$.featuredProjects", hasSize(2)))
                .andExpect(jsonPath("$.education", hasSize(4)))
                .andExpect(jsonPath("$.certificates", hasSize(1)))
                .andExpect(jsonPath("$.publications", hasSize(1)))
                .andExpect(jsonPath("$.experience", hasSize(0)))
                .andReturn();

        String etag = result.getResponse().getHeader(HttpHeaders.ETAG);

        // Verify conditional 304 response
        mockMvc.perform(get("/api/v1/public/portfolio")
                        .header(HttpHeaders.IF_NONE_MATCH, etag)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotModified());
    }

    @Test
    @DisplayName("GET /api/v1/public/portfolio/profile returns owner profile")
    void shouldReturnProfile() throws Exception {
        mockMvc.perform(get("/api/v1/public/portfolio/profile")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", equalTo("Girish Gowda H R")))
                .andExpect(jsonPath("$.headline", equalTo("Software Engineer | Java, SQL & Full-Stack Development")))
                .andExpect(jsonPath("$.location", equalTo("Bengaluru, Karnataka")));
    }

    @Test
    @DisplayName("GET /api/v1/public/portfolio/projects returns projects list")
    void shouldReturnProjects() throws Exception {
        mockMvc.perform(get("/api/v1/public/portfolio/projects")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].slug", hasItems("digital-twin", "population")));
    }

    @Test
    @DisplayName("GET /api/v1/public/portfolio/projects/{slug} returns 200 for existing project and 404 for unknown")
    void shouldReturnProjectBySlugOr404() throws Exception {
        mockMvc.perform(get("/api/v1/public/portfolio/projects/digital-twin")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug", equalTo("digital-twin")))
                .andExpect(jsonPath("$.technologies", hasItem("Java")));

        mockMvc.perform(get("/api/v1/public/portfolio/projects/non-existent-project")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("application/problem+json")));
    }

    @Test
    @DisplayName("GET /api/v1/public/portfolio/resume returns downloadable markdown resume")
    void shouldReturnResumeDownload() throws Exception {
        mockMvc.perform(get("/api/v1/public/portfolio/resume"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, containsString("attachment")))
                .andExpect(content().string(containsString("Girish Gowda H R")))
                .andExpect(content().string(containsString("RV College of Engineering")))
                .andExpect(content().string(not(containsStringIgnoringCase("synthetic"))));
    }
}
