package com.girish.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.portfolio.application.PortfolioContentImportService;
import com.girish.portfolio.infra.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class PortfolioContentImportServiceTest {

    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private SkillCategoryRepository skillCategoryRepository;
    @Mock
    private SkillItemRepository skillItemRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ExperienceRepository experienceRepository;
    @Mock
    private EducationRepository educationRepository;
    @Mock
    private CertificateRepository certificateRepository;
    @Mock
    private PublicationRepository publicationRepository;

    private PortfolioContentImportService importService;

    @BeforeEach
    void setUp() {
        importService = new PortfolioContentImportService(
                new ObjectMapper(),
                profileRepository,
                skillCategoryRepository,
                skillItemRepository,
                projectRepository,
                experienceRepository,
                educationRepository,
                certificateRepository,
                publicationRepository
        );
    }

    @Test
    @DisplayName("Should successfully parse and validate authentic owner resume content JSON")
    void shouldParseAndValidateContent() throws IOException {
        try (InputStream is = getClass().getResourceAsStream("/content/girish-content.json")) {
            assertThat(is).isNotNull();
            PortfolioContentImportService.ContentDocument doc = importService.parseAndValidate(is);

            assertThat(doc).isNotNull();
            assertThat(doc.profile.displayName).isEqualTo("Girish Gowda H R");
            assertThat(doc.profile.headline).contains("Software Engineer");
            assertThat(doc.education).hasSize(4);
            assertThat(doc.skills).hasSize(7);
            assertThat(doc.projects).hasSize(2);
            assertThat(doc.publications).hasSize(1);
            assertThat(doc.certificates).hasSize(1);
            assertThat(doc.experience).isEmpty();
        }
    }

    @Test
    @DisplayName("Should reject JSON with unknown fields (FAIL_ON_UNKNOWN_PROPERTIES)")
    void shouldRejectUnknownFields() {
        String invalidJson = """
                {
                  "contentVersion": 1,
                  "source": "test",
                  "unexpectedField": "illegal_data",
                  "rules": { "publishOnlyIfStatus": ["CONFIRMED_FROM_RESUME"], "unconfirmedNeverPublished": true },
                  "profile": { "id": "p", "status": "CONFIRMED_FROM_RESUME", "visibility": "PUBLISHED", "displayName": "Girish", "headline": "Dev", "location": "BLR", "languages": [], "summary": "bio", "careerGoal": "role" },
                  "contacts": [],
                  "education": [],
                  "skills": [],
                  "projects": [],
                  "publications": [],
                  "certificates": [],
                  "achievements": [],
                  "experience": [],
                  "keyStrengths": [],
                  "ownerQuestionsOpen": []
                }
                """;

        assertThatThrownBy(() -> importService.parseAndValidate(new ByteArrayInputStream(invalidJson.getBytes(StandardCharsets.UTF_8))))
                .isInstanceOf(Exception.class)
                .hasMessageContaining("unexpectedField");
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when profile display name is missing")
    void shouldFailWhenNameMissing() {
        String json = """
                {
                  "contentVersion": 1,
                  "source": "test",
                  "rules": { "publishOnlyIfStatus": ["CONFIRMED_FROM_RESUME"], "unconfirmedNeverPublished": true },
                  "profile": { "id": "p", "status": "CONFIRMED_FROM_RESUME", "visibility": "PUBLISHED", "displayName": "", "headline": "Dev", "location": "BLR", "languages": [], "summary": "bio", "careerGoal": "role" },
                  "contacts": [],
                  "education": [],
                  "skills": [],
                  "projects": [],
                  "publications": [],
                  "certificates": [],
                  "achievements": [],
                  "experience": [],
                  "keyStrengths": [],
                  "ownerQuestionsOpen": []
                }
                """;

        assertThatThrownBy(() -> importService.parseAndValidate(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Profile display name is required");
    }
}
