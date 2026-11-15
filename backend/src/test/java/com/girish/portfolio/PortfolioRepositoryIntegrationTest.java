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

    @Autowired
    private PublicationRepository publicationRepository;

    @Test
    @DisplayName("Should successfully load confirmed owner profile")
    void shouldLoadConfirmedProfile() {
        Optional<Profile> profileOpt = profileRepository.findFirstByIsPublishedTrue();

        assertThat(profileOpt).isPresent();
        Profile profile = profileOpt.get();
        assertThat(profile.getFullName()).isEqualTo("Girish Gowda H R");
        assertThat(profile.getHeadline()).isEqualTo("Software Engineer | Java, SQL & Full-Stack Development");
        assertThat(profile.getLocation()).isEqualTo("Bengaluru, Karnataka");
    }

    @Test
    @DisplayName("Should load confirmed skill categories and items")
    void shouldLoadConfirmedSkills() {
        List<SkillCategory> categories = skillCategoryRepository.findAllWithItemsOrderBySortOrderAsc();

        assertThat(categories).hasSize(7);
        assertThat(categories).extracting(SkillCategory::getName)
                .contains("Programming Languages", "Web & Software Development", "Databases & Data Management");
    }

    @Test
    @DisplayName("Should load confirmed projects")
    void shouldLoadConfirmedProjects() {
        List<Project> projects = projectRepository.findByIsPublishedTrueOrderBySortOrderAsc();

        assertThat(projects).hasSize(2);
        assertThat(projects).extracting(Project::getSlug)
                .contains("digital-twin", "population");

        Optional<Project> digitalTwin = projectRepository.findBySlugAndIsPublishedTrue("digital-twin");
        assertThat(digitalTwin).isPresent();
        assertThat(digitalTwin.get().getTechnologies()).contains("Java");
        assertThat(digitalTwin.get().getTitle()).contains("Digital Twin");
    }

    @Test
    @DisplayName("Should load confirmed education, certificates, and publications")
    void shouldLoadConfirmedEducationCertificatesAndPublications() {
        List<Education> educations = educationRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(educations).hasSize(4);
        assertThat(educations).extracting(Education::getInstitution)
                .contains("RV College of Engineering", "Vidyavahini First Grade College");

        List<Certificate> certificates = certificateRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(certificates).hasSize(1);
        assertThat(certificates.get(0).getName()).isEqualTo("Certified Fitness Trainer");

        List<Publication> publications = publicationRepository.findByIsPublishedTrueOrderBySortOrderAsc();
        assertThat(publications).hasSize(1);
        assertThat(publications.get(0).getTitle()).contains("Digital Twin");
        assertThat(publications.get(0).getPublisher()).isEqualTo("IEEE");
    }
}
