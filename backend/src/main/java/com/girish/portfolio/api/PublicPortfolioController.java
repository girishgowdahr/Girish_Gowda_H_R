package com.girish.portfolio.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.portfolio.api.dto.*;
import com.girish.portfolio.application.PublicPortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/portfolio")
@Tag(name = "Public Portfolio", description = "Public endpoints for Girish Gowda H R professional portfolio")
public class PublicPortfolioController {

    private final PublicPortfolioService portfolioService;
    private final ObjectMapper objectMapper;

    public PublicPortfolioController(PublicPortfolioService portfolioService, ObjectMapper objectMapper) {
        this.portfolioService = portfolioService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @Operation(summary = "Get full portfolio summary", description = "Aggregated public portfolio snapshot for single-request initial rendering")
    public ResponseEntity<PublicPortfolioSummaryDto> getPortfolioSummary(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        PublicPortfolioSummaryDto summary = portfolioService.getPortfolioSummary();
        return buildCachedResponse(summary, ifNoneMatch);
    }

    @GetMapping("/profile")
    @Operation(summary = "Get owner profile", description = "Returns public biographical profile and verified social links")
    public ResponseEntity<PublicProfileDto> getProfile(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        PublicProfileDto profile = portfolioService.getPublicProfile();
        return buildCachedResponse(profile, ifNoneMatch);
    }

    @GetMapping("/skills")
    @Operation(summary = "List technical skill categories", description = "Grouped skill matrix with proficiency and experience")
    public ResponseEntity<List<PublicSkillCategoryDto>> getSkills(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicSkillCategoryDto> skills = portfolioService.getPublicSkills();
        return buildCachedResponse(skills, ifNoneMatch);
    }

    @GetMapping("/projects")
    @Operation(summary = "List portfolio projects", description = "Published engineering projects, source links, and technologies")
    public ResponseEntity<List<PublicProjectDto>> getProjects(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicProjectDto> projects = portfolioService.getPublicProjects();
        return buildCachedResponse(projects, ifNoneMatch);
    }

    @GetMapping("/projects/{slug}")
    @Operation(summary = "Get project by slug", description = "Detailed project record by unique URL slug")
    public ResponseEntity<PublicProjectDto> getProjectBySlug(
            @PathVariable String slug,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        PublicProjectDto project = portfolioService.getPublicProjectBySlug(slug);
        return buildCachedResponse(project, ifNoneMatch);
    }

    @GetMapping("/experience")
    @Operation(summary = "List professional experience", description = "Chronological career history and technical achievements")
    public ResponseEntity<List<PublicExperienceDto>> getExperience(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicExperienceDto> experience = portfolioService.getPublicExperience();
        return buildCachedResponse(experience, ifNoneMatch);
    }

    @GetMapping("/education")
    @Operation(summary = "List academic education", description = "University degrees and educational background")
    public ResponseEntity<List<PublicEducationDto>> getEducation(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicEducationDto> education = portfolioService.getPublicEducation();
        return buildCachedResponse(education, ifNoneMatch);
    }

    @GetMapping("/certificates")
    @Operation(summary = "List professional certificates", description = "Verified industry licensures and technical certifications")
    public ResponseEntity<List<PublicCertificateDto>> getCertificates(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicCertificateDto> certificates = portfolioService.getPublicCertificates();
        return buildCachedResponse(certificates, ifNoneMatch);
    }

    @GetMapping("/publications")
    @Operation(summary = "List research publications", description = "Verified academic publications, journals, and conference papers")
    public ResponseEntity<List<PublicPublicationDto>> getPublications(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<PublicPublicationDto> publications = portfolioService.getPublicPublications();
        return buildCachedResponse(publications, ifNoneMatch);
    }

    @GetMapping("/resume")
    @Operation(summary = "Download official resume", description = "Returns downloadable resume curriculum vitae document")
    public ResponseEntity<byte[]> downloadResume() {
        PublicProfileDto profile = portfolioService.getPublicProfile();
        String resumeMarkdown = """
                # %s
                **%s**
                Location: %s
                
                ## Summary
                %s
                
                ## Education
                - **Master of Computer Applications (MCA)** — RV College of Engineering, Bengaluru (2025 – 2027, In Progress)
                - **Bachelor of Computer Applications (BCA)** — Vidyavahini First Grade College, Tumkur (2021 – 2024, CGPA: 8.91/10.0)
                - **PUC (Science)** — St. Philomena's PU College, Mysore (Completed 2021, 86.5%%)
                - **SSLC** — St. Anne's High School, Dodda Alahalli (Completed 2019, 86.24%%)
                
                ## Technical Skills
                - **Programming Languages:** Java (OOP, Collections, Exception Handling, File Handling), Python, C, SQL
                - **Web & Software Development:** HTML5, CSS3, Bootstrap, Servlet Development (Java EE), Reusable component design
                - **Databases & Data Management:** SQL (DDL, DML, DQL, DCL, TCL), Sub-queries, Normalization, Data Analytics
                - **Software Development Lifecycle:** Requirements analysis, Design, Development, Testing, Deployment, Support
                - **Practices & Tools:** Agile teamwork, Version control fundamentals, Data Structures, Computer Architecture
                
                ## Projects
                - **Digital Twin-Enabled Self-Healing Web Application** (Team Project, 2023 – 2024)
                  Designed and implemented self-healing web application using Digital Twin technology to monitor systems and auto-recover from failures.
                - **Population Analysis of Karnataka Districts** (Academic Project, 2022)
                  Built C-language application to ingest, process, and display census-style population data for Karnataka districts.
                
                ## Publications
                - **Digital Twin-Enabled Self-Healing Web Application** — IEEE (2026), Approved & Published (Co-author)
                
                ## Certifications
                - **Certified Fitness Trainer** — Indian Institute of Skill Development Training
                """.formatted(
                profile.fullName(),
                profile.headline(),
                profile.location() != null ? profile.location() : "Bengaluru, Karnataka",
                profile.bio()
        );

        byte[] resumeBytes = resumeMarkdown.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Girish_Gowda_H_R_Resume.md\"")
                .contentType(MediaType.parseMediaType("text/markdown"))
                .body(resumeBytes);
    }

    private <T> ResponseEntity<T> buildCachedResponse(T data, String ifNoneMatch) {
        String json;
        try {
            json = objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            json = data.toString();
        }

        String etag = "\"" + DigestUtils.md5DigestAsHex(json.getBytes(StandardCharsets.UTF_8)) + "\"";

        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .eTag(etag)
                    .cacheControl(CacheControl.maxAge(Duration.ofSeconds(60)).cachePublic())
                    .build();
        }

        return ResponseEntity.ok()
                .eTag(etag)
                .cacheControl(CacheControl.maxAge(Duration.ofSeconds(60)).cachePublic())
                .body(data);
    }
}
