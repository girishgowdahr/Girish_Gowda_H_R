package com.girish.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.portfolio.api.dto.*;
import com.girish.portfolio.application.PortfolioContentImportService;
import com.girish.portfolio.application.PublicPortfolioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortfolioContentImportServiceTest {

    @Mock
    private PublicPortfolioService publicPortfolioService;

    private PortfolioContentImportService importService;

    @BeforeEach
    void setUp() {
        importService = new PortfolioContentImportService(new ObjectMapper(), publicPortfolioService);
    }

    @Test
    @DisplayName("Should successfully parse and validate valid portfolio JSON string")
    void shouldParseAndValidate() throws IOException {
        String json = """
                {
                  "profile": {
                    "fullName": "Girish Gowda H R",
                    "headline": "Full-Stack Software Engineer",
                    "bio": "Bio description",
                    "location": "Bengaluru, India",
                    "email": "girishgowda0428@gmail.com",
                    "githubUrl": "https://github.com/girishgowdahr"
                  },
                  "skillCategories": [],
                  "featuredProjects": [],
                  "experience": [],
                  "education": [],
                  "certificates": []
                }
                """;

        PublicPortfolioSummaryDto summary = importService.parseAndValidate(json);

        assertThat(summary).isNotNull();
        assertThat(summary.profile().fullName()).isEqualTo("Girish Gowda H R");
        assertThat(summary.profile().email()).isEqualTo("girishgowda0428@gmail.com");
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when profile full name is missing")
    void shouldFailWhenNameMissing() {
        String json = """
                {
                  "profile": {
                    "headline": "Full-Stack Software Engineer",
                    "email": "girishgowda0428@gmail.com"
                  }
                }
                """;

        assertThatThrownBy(() -> importService.parseAndValidate(json))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Profile full name is required");
    }

    @Test
    @DisplayName("Should export current portfolio state as formatted JSON")
    void shouldExportCurrentContent() throws IOException {
        PublicProfileDto profile = new PublicProfileDto(
                "Girish Gowda H R", "Headline", "Bio", "Bengaluru", "girishgowda0428@gmail.com",
                "https://github.com/girishgowdahr", null, null, null
        );
        PublicPortfolioSummaryDto summary = new PublicPortfolioSummaryDto(
                profile, Collections.emptyList(), Collections.emptyList(),
                Collections.emptyList(), Collections.emptyList(), Collections.emptyList()
        );

        when(publicPortfolioService.getPortfolioSummary()).thenReturn(summary);

        String json = importService.exportCurrentContentAsJson();

        assertThat(json).isNotBlank();
        assertThat(json).contains("Girish Gowda H R");
        assertThat(json).contains("girishgowda0428@gmail.com");
    }
}
