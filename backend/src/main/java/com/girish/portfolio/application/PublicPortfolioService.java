package com.girish.portfolio.application;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.common.error.ResourceNotFoundException;
import com.girish.portfolio.api.dto.*;
import com.girish.portfolio.domain.*;
import com.girish.portfolio.infra.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PublicPortfolioService {

    private final ProfileRepository profileRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final CertificateRepository certificateRepository;
    private final PublicationRepository publicationRepository;
    private final ObjectMapper objectMapper;

    public PublicPortfolioService(
            ProfileRepository profileRepository,
            SkillCategoryRepository skillCategoryRepository,
            ProjectRepository projectRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            CertificateRepository certificateRepository,
            PublicationRepository publicationRepository,
            ObjectMapper objectMapper
    ) {
        this.profileRepository = profileRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.certificateRepository = certificateRepository;
        this.publicationRepository = publicationRepository;
        this.objectMapper = objectMapper;
    }

    public PublicProfileDto getPublicProfile() {
        return profileRepository.findFirstByIsPublishedTrue()
                .map(this::toProfileDto)
                .orElseThrow(() -> new ResourceNotFoundException("Published portfolio profile not found"));
    }

    public List<PublicSkillCategoryDto> getPublicSkills() {
        return skillCategoryRepository.findAllWithItemsOrderBySortOrderAsc()
                .stream()
                .map(this::toSkillCategoryDto)
                .toList();
    }

    public List<PublicProjectDto> getPublicProjects() {
        return projectRepository.findByIsPublishedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toProjectDto)
                .toList();
    }

    public PublicProjectDto getPublicProjectBySlug(String slug) {
        return projectRepository.findBySlugAndIsPublishedTrue(slug)
                .map(this::toProjectDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));
    }

    public List<PublicExperienceDto> getPublicExperience() {
        return experienceRepository.findByIsPublishedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toExperienceDto)
                .toList();
    }

    public List<PublicEducationDto> getPublicEducation() {
        return educationRepository.findByIsPublishedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toEducationDto)
                .toList();
    }

    public List<PublicCertificateDto> getPublicCertificates() {
        return certificateRepository.findByIsPublishedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toCertificateDto)
                .toList();
    }

    public List<PublicPublicationDto> getPublicPublications() {
        return publicationRepository.findByIsPublishedTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toPublicationDto)
                .toList();
    }

    public PublicPortfolioSummaryDto getPortfolioSummary() {
        PublicProfileDto profile = getPublicProfile();
        List<PublicSkillCategoryDto> skills = getPublicSkills();
        List<PublicProjectDto> projects = getPublicProjects();
        List<PublicExperienceDto> experience = getPublicExperience();
        List<PublicEducationDto> education = getPublicEducation();
        List<PublicCertificateDto> certificates = getPublicCertificates();
        List<PublicPublicationDto> publications = getPublicPublications();

        return new PublicPortfolioSummaryDto(profile, skills, projects, experience, education, certificates, publications);
    }

    private PublicProfileDto toProfileDto(Profile profile) {
        return new PublicProfileDto(
                profile.getFullName(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getLocation(),
                profile.getEmail(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getResumeUrl(),
                profile.getAvatarImageUrl()
        );
    }

    private PublicSkillCategoryDto toSkillCategoryDto(SkillCategory category) {
        List<PublicSkillItemDto> items = category.getItems().stream()
                .map(item -> new PublicSkillItemDto(
                        item.getName(),
                        item.getProficiency(),
                        item.getYearsOfExperience(),
                        item.getIcon(),
                        item.isFeatured()
                ))
                .toList();

        return new PublicSkillCategoryDto(category.getName(), category.getSortOrder(), items);
    }

    private PublicProjectDto toProjectDto(Project project) {
        return new PublicProjectDto(
                project.getSlug(),
                project.getTitle(),
                project.getTagline(),
                project.getDescription(),
                project.getCategory(),
                parseJsonList(project.getTechnologies()),
                project.getGithubUrl(),
                project.getLiveUrl(),
                project.getDemoUrl(),
                project.isFeatured(),
                project.getSortOrder()
        );
    }

    private PublicExperienceDto toExperienceDto(Experience exp) {
        return new PublicExperienceDto(
                exp.getRoleTitle(),
                exp.getCompanyName(),
                exp.getEmploymentType(),
                exp.getLocation(),
                exp.getStartDate(),
                exp.getEndDate(),
                exp.isCurrent(),
                exp.getDescription(),
                parseJsonList(exp.getHighlights()),
                parseJsonList(exp.getTechnologies()),
                exp.getSortOrder()
        );
    }

    private PublicEducationDto toEducationDto(Education edu) {
        return new PublicEducationDto(
                edu.getInstitution(),
                edu.getDegree(),
                edu.getFieldOfStudy(),
                edu.getStartYear() != null ? edu.getStartYear() : 0,
                edu.getEndYear(),
                edu.getGradeOrGpa(),
                edu.getDescription(),
                edu.getSortOrder()
        );
    }

    private PublicCertificateDto toCertificateDto(Certificate cert) {
        return new PublicCertificateDto(
                cert.getName(),
                cert.getIssuingOrganization(),
                cert.getIssueDate(),
                cert.getExpirationDate(),
                cert.getCredentialId(),
                cert.getCredentialUrl(),
                cert.getSortOrder()
        );
    }

    private PublicPublicationDto toPublicationDto(Publication pub) {
        return new PublicPublicationDto(
                pub.getId().toString(),
                pub.getTitle(),
                pub.getPublisher(),
                pub.getPublicationYear(),
                pub.getState(),
                pub.getRole(),
                pub.getAbstractSummary(),
                pub.getDoi(),
                pub.getUrl(),
                pub.getConference()
        );
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PublicPortfolioService.class);

    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            String text = json.trim();
            if (text.startsWith("\"") && text.endsWith("\"")) {
                text = objectMapper.readValue(text, String.class);
            }
            return objectMapper.readValue(text, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse JSON list from payload: [{}]", json, e);
            return Collections.emptyList();
        }
    }
}
