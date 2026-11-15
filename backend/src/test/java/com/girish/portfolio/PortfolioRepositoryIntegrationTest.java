package com.girish.portfolio;

import com.girish.portfolio.domain.*;
import com.girish.portfolio.infra.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PortfolioRepositoryIntegrationTest {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Test
    @DisplayName("Should successfully load seeded owner profile")
    void shouldLoadSeededProfile() {
        Optional<Profile> profileOpt = profileRepository.findFirstByIsPublishedTrue();

        assertThat(profileOpt).isPresent();
        Profile profile = profileOpt.get();
        assertThat(profile.getFullName()).isEqualTo("Girish Gowda H R");
        assertThat(profile.getEmail()).isEqualTo("girishgowda0428@gmail.com");
        assertThat(profile.getGithubUrl()).contains("girishgowdahr");
    }

    @Test
    @DisplayName("Should load seeded skill categories and items")
    void shouldLoadSeededSkills() {
        List<SkillCategory> categories = skillCategoryRepository.findAllWithItemsOrderBySortOrderAsc();

        assertThat(categories).isNotEmpty();
        assertThat(categories).hasSizeGreaterThanOrEqualTo(4);

        SkillCategory firstCategory = categories.get(0);
        assertThat(firstCategory.getItems()).isNotEmpty();
    }

    @Test
    @DisplayName("Should load seeded projects")
    void shouldLoadSeededProjects() {
        List<Project> projects = projectRepository.findByIsPublishedTrueOrderBySortOrderAsc();

        assertThat(projects).isNotEmpty();
        assertThat(projects).extracting(Project::getSlug)
                .contains("girish-identity-platform", "free-fire-avatar-engine");

        Optional<Project> freeFire = projectRepository.findBySlugAndIsPublishedTrue("free-fire-avatar-engine");
        assertThat(freeFire).isPresent();
        assertThat(freeFire.get().getTechnologies()).contains("Three.js");
    }

    @Test
    @DisplayName("Should load seeded experience, education, and certificates")
    void shouldLoadSeededExperienceEducationAndCertificates() {
        List<Experience> experiences = experienceRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(experiences).isNotEmpty();

        List<Education> educations = educationRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(educations).isNotEmpty();

        List<Certificate> certificates = certificateRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(certificates).isNotEmpty();
    }
}
