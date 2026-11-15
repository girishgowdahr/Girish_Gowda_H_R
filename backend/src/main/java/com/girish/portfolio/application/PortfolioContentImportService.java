package com.girish.portfolio.application;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.portfolio.domain.*;
import com.girish.portfolio.infra.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class PortfolioContentImportService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioContentImportService.class);

    private final ObjectMapper objectMapper;
    private final ProfileRepository profileRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillItemRepository skillItemRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final CertificateRepository certificateRepository;
    private final PublicationRepository publicationRepository;

    public PortfolioContentImportService(
            ObjectMapper objectMapper,
            ProfileRepository profileRepository,
            SkillCategoryRepository skillCategoryRepository,
            SkillItemRepository skillItemRepository,
            ProjectRepository projectRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            CertificateRepository certificateRepository,
            PublicationRepository publicationRepository
    ) {
        this.objectMapper = objectMapper.copy()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true);
        this.profileRepository = profileRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillItemRepository = skillItemRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.certificateRepository = certificateRepository;
        this.publicationRepository = publicationRepository;
    }

    public ContentDocument parseAndValidate(InputStream inputStream) throws IOException {
        ContentDocument doc = objectMapper.readValue(inputStream, ContentDocument.class);
        validateDocument(doc);
        return doc;
    }

    public ContentDocument parseAndValidate(String jsonContent) throws IOException {
        ContentDocument doc = objectMapper.readValue(jsonContent, ContentDocument.class);
        validateDocument(doc);
        return doc;
    }

    @Transactional
    public void importContent(InputStream inputStream) throws IOException {
        ContentDocument doc = parseAndValidate(inputStream);
        applyImport(doc);
    }

    @Transactional
    public void importContent(String jsonContent) throws IOException {
        ContentDocument doc = parseAndValidate(jsonContent);
        applyImport(doc);
    }

    @Transactional
    public boolean importDefaultContentFileIfPresent() {
        // Check local filesystem root or classpath
        File file = new File("content/girish-content.json");
        if (!file.exists()) {
            file = new File("../content/girish-content.json");
        }
        if (file.exists() && file.isFile()) {
            try (InputStream is = new FileInputStream(file)) {
                log.info("Importing verified resume content from filesystem: {}", file.getAbsolutePath());
                importContent(is);
                return true;
            } catch (Exception e) {
                log.error("Failed to import content from filesystem file: {}", file.getAbsolutePath(), e);
            }
        }

        try {
            ClassPathResource cpr = new ClassPathResource("content/girish-content.json");
            if (cpr.exists()) {
                try (InputStream is = cpr.getInputStream()) {
                    log.info("Importing verified resume content from classpath resource");
                    importContent(is);
                    return true;
                }
            }
        } catch (Exception e) {
            log.error("Failed to import content from classpath", e);
        }

        return false;
    }

    private void validateDocument(ContentDocument doc) {
        if (doc == null) {
            throw new IllegalArgumentException("Content document must not be null");
        }
        if (doc.profile == null || doc.profile.displayName == null || doc.profile.displayName.isBlank()) {
            throw new IllegalArgumentException("Profile display name is required");
        }
        if (doc.rules == null || doc.rules.publishOnlyIfStatus == null || doc.rules.publishOnlyIfStatus.isEmpty()) {
            throw new IllegalArgumentException("Publishing rules must be specified");
        }
    }

    private boolean isPublishable(String status, String visibility, List<String> allowedStatuses) {
        if (status == null || visibility == null) {
            return false;
        }
        boolean statusAllowed = allowedStatuses.contains(status)
                || "CONFIRMED_FROM_RESUME".equals(status)
                || "CONFIRMED_BY_OWNER".equals(status);
        return statusAllowed && "PUBLISHED".equalsIgnoreCase(visibility);
    }

    private void applyImport(ContentDocument doc) throws IOException {
        List<String> allowedStatuses = doc.rules.publishOnlyIfStatus != null ? doc.rules.publishOnlyIfStatus : List.of();
        OffsetDateTime now = OffsetDateTime.now();

        // 1. Profile
        boolean profilePublished = isPublishable(doc.profile.status, doc.profile.visibility, allowedStatuses);
        UUID profileId = UUID.nameUUIDFromBytes(doc.profile.id.getBytes(StandardCharsets.UTF_8));
        String languagesJson = objectMapper.writeValueAsString(doc.profile.languages != null ? doc.profile.languages : List.of());

        // Contacts resolution: only published contacts can be exposed
        String publishedEmail = null;
        String publishedGithub = null;
        String publishedLinkedin = null;

        if (doc.contacts != null) {
            for (ContactItem c : doc.contacts) {
                if (isPublishable(c.status, c.visibility, allowedStatuses) && c.value != null && !c.value.isBlank()) {
                    if ("email".equalsIgnoreCase(c.type)) {
                        publishedEmail = c.value;
                    } else if ("github".equalsIgnoreCase(c.type)) {
                        publishedGithub = c.value;
                    } else if ("linkedin".equalsIgnoreCase(c.type)) {
                        publishedLinkedin = c.value;
                    }
                }
            }
        }

        Profile profile = profileRepository.findById(profileId)
                .orElse(new Profile());
        profile.setId(profileId);
        profile.setFullName(doc.profile.displayName);
        profile.setHeadline(doc.profile.headline);
        profile.setBio(doc.profile.summary);
        profile.setLocation(doc.profile.location);
        profile.setEmail(publishedEmail);
        profile.setGithubUrl(publishedGithub);
        profile.setLinkedinUrl(publishedLinkedin);
        profile.setResumeUrl("/api/v1/public/portfolio/resume");
        profile.setLanguages(languagesJson);
        profile.setCareerGoal(doc.profile.careerGoal);
        profile.setStatus(doc.profile.status);
        profile.setPublished(profilePublished);
        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(now);
        }
        profile.setUpdatedAt(now);
        profileRepository.save(profile);

        // 2. Education
        educationRepository.deleteAllInBatch();
        if (doc.education != null) {
            for (EducationItem edu : doc.education) {
                UUID id = UUID.nameUUIDFromBytes(edu.id.getBytes(StandardCharsets.UTF_8));
                boolean published = isPublishable(edu.status, edu.visibility, allowedStatuses);

                Integer startYear = edu.start != null ? parseYear(edu.start) : null;
                Integer endYear = edu.end != null ? parseYear(edu.end) : null;

                String gradeOrGpa = null;
                if (edu.score != null && edu.score.type != null) {
                    if ("CGPA".equalsIgnoreCase(edu.score.type)) {
                        gradeOrGpa = "CGPA " + edu.score.value + "/" + edu.score.outOf;
                    } else if ("PERCENTAGE".equalsIgnoreCase(edu.score.type)) {
                        gradeOrGpa = edu.score.value + "%";
                    }
                }

                String description = null;
                if (Boolean.TRUE.equals(edu.inProgress)) {
                    description = "In progress. Expected completion: " + (edu.end != null ? edu.end : "2027");
                }

                Education education = new Education(
                        id,
                        edu.institution,
                        edu.level,
                        edu.level,
                        edu.city,
                        startYear,
                        endYear,
                        gradeOrGpa,
                        description,
                        edu.status,
                        edu.sortOrder,
                        published,
                        now,
                        now
                );
                educationRepository.save(education);
            }
        }

        // 3. Skills
        skillItemRepository.deleteAllInBatch();
        skillCategoryRepository.deleteAllInBatch();
        if (doc.skills != null) {
            for (SkillGroup group : doc.skills) {
                UUID catId = UUID.nameUUIDFromBytes(group.id.getBytes(StandardCharsets.UTF_8));
                boolean catPublished = isPublishable(group.status, group.visibility, allowedStatuses);
                SkillCategory category = new SkillCategory(catId, group.group, group.sortOrder, now, now);

                if (group.items != null && catPublished) {
                    int itemIdx = 0;
                    for (String itemStr : group.items) {
                        UUID itemId = UUID.nameUUIDFromBytes((group.id + ":" + itemStr).getBytes(StandardCharsets.UTF_8));
                        SkillItem item = new SkillItem(
                                itemId,
                                category,
                                itemStr,
                                null,
                                null,
                                null,
                                itemIdx * 10,
                                false
                        );
                        category.getItems().add(item);
                        itemIdx++;
                    }
                }
                skillCategoryRepository.save(category);
            }
        }

        // 4. Projects
        projectRepository.deleteAllInBatch();
        if (doc.projects != null) {
            for (ProjectItem proj : doc.projects) {
                UUID id = UUID.nameUUIDFromBytes(proj.id.getBytes(StandardCharsets.UTF_8));
                boolean published = isPublishable(proj.status, proj.visibility, allowedStatuses);

                String bulletsJson = objectMapper.writeValueAsString(proj.bullets != null ? proj.bullets : List.of());
                String techJson = objectMapper.writeValueAsString(proj.technologies != null ? proj.technologies : List.of());
                String description = (proj.bullets != null && !proj.bullets.isEmpty()) ? proj.bullets.get(0) : proj.title;

                String slug = proj.id.toLowerCase().replace("proj-", "").replace("_", "-");

                Project project = new Project(
                        id,
                        slug,
                        proj.title,
                        proj.kind != null ? proj.kind : "Software Project",
                        proj.kind,
                        description,
                        "Software Engineering",
                        techJson,
                        bulletsJson,
                        proj.repoUrl,
                        proj.demoUrl,
                        null,
                        proj.status,
                        proj.sortOrder == 1,
                        proj.sortOrder,
                        published,
                        now,
                        now
                );
                projectRepository.save(project);
            }
        }

        // 5. Publications
        publicationRepository.deleteAllInBatch();
        if (doc.publications != null) {
            for (PublicationItem pub : doc.publications) {
                UUID id = UUID.nameUUIDFromBytes(pub.id.getBytes(StandardCharsets.UTF_8));
                boolean published = isPublishable(pub.status, pub.visibility, allowedStatuses);

                Publication publication = new Publication(
                        id,
                        pub.title,
                        pub.publisher,
                        pub.year,
                        pub.state,
                        pub.role,
                        pub.abstractSummary,
                        pub.doi,
                        pub.url,
                        pub.conference,
                        pub.sortOrder,
                        published,
                        pub.status,
                        now,
                        now
                );
                publicationRepository.save(publication);
            }
        }

        // 6. Certificates
        certificateRepository.deleteAllInBatch();
        if (doc.certificates != null) {
            for (CertificateItem cert : doc.certificates) {
                UUID id = UUID.nameUUIDFromBytes(cert.id.getBytes(StandardCharsets.UTF_8));
                boolean published = isPublishable(cert.status, cert.visibility, allowedStatuses);

                Certificate certificate = new Certificate(
                        id,
                        cert.title,
                        cert.issuer,
                        null,
                        null,
                        cert.credentialId,
                        null,
                        cert.description,
                        cert.status,
                        cert.sortOrder,
                        published,
                        now,
                        now
                );
                certificateRepository.save(certificate);
            }
        }

        // 7. Experience (Empty in owner resume)
        experienceRepository.deleteAllInBatch();

        log.info("Portfolio content successfully imported and synchronized idempotently for operator: {}", doc.profile.displayName);
    }

    private Integer parseYear(String yearStr) {
        if (yearStr == null || yearStr.isBlank()) {
            return null;
        }
        try {
            return Integer.parseInt(yearStr.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // --- Typed Data Transfer Mapping Classes ---

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class ContentDocument {
        public int contentVersion;
        public String source;
        public RulesNode rules;
        public ProfileNode profile;
        public List<ContactItem> contacts;
        public List<EducationItem> education;
        public List<SkillGroup> skills;
        public List<ProjectItem> projects;
        public List<PublicationItem> publications;
        public List<CertificateItem> certificates;
        public List<Object> achievements;
        public List<Object> experience;
        public List<String> keyStrengths;
        public List<String> ownerQuestionsOpen;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class RulesNode {
        public List<String> publishOnlyIfStatus;
        public boolean unconfirmedNeverPublished;
        public String phoneNumber;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class ProfileNode {
        public String id;
        public String status;
        public String visibility;
        public String displayName;
        public String headline;
        public String location;
        public List<String> languages;
        public String summary;
        public String careerGoal;
        public String availabilityStatus;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class ContactItem {
        public String id;
        public String type;
        public String value;
        public String status;
        public String visibility;
        public String note;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class EducationItem {
        public String id;
        public String level;
        public String institution;
        public String city;
        public String start;
        public String end;
        public Boolean endIsExpected;
        public Boolean inProgress;
        public ScoreNode score;
        public String status;
        public String visibility;
        public int sortOrder;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class ScoreNode {
        public String type;
        public Double value;
        public Double outOf;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class SkillGroup {
        public String id;
        public String group;
        public List<String> items;
        public String status;
        public String visibility;
        public int sortOrder;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class ProjectItem {
        public String id;
        public String title;
        public String kind;
        public String start;
        public String end;
        public List<String> bullets;
        public List<String> technologies;
        public List<Object> links;
        public String repoUrl;
        public String demoUrl;
        public String status;
        public String visibility;
        public int sortOrder;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class PublicationItem {
        public String id;
        public String title;
        public String publisher;
        public String year;
        public String state;
        public String role;
        public String abstractSummary;
        public String doi;
        public String url;
        public String conference;
        public String status;
        public String visibility;
        public List<String> missingFields;
        public int sortOrder;
    }

    @JsonIgnoreProperties(ignoreUnknown = false)
    public static class CertificateItem {
        public String id;
        public String title;
        public String issuer;
        public String issueDate;
        public String credentialId;
        public String media;
        public String description;
        public String status;
        public String visibility;
        public List<String> missingFields;
        public int sortOrder;
    }
}
