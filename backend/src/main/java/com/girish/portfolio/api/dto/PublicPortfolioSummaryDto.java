package com.girish.portfolio.api.dto;

import java.util.List;

public record PublicPortfolioSummaryDto(
        PublicProfileDto profile,
        List<PublicSkillCategoryDto> skillCategories,
        List<PublicProjectDto> featuredProjects,
        List<PublicExperienceDto> experience,
        List<PublicEducationDto> education,
        List<PublicCertificateDto> certificates,
        List<PublicPublicationDto> publications
) {
}
