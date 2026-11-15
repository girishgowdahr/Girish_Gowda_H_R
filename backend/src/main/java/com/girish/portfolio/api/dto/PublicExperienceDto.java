package com.girish.portfolio.api.dto;

import java.time.LocalDate;
import java.util.List;

public record PublicExperienceDto(
        String roleTitle,
        String companyName,
        String employmentType,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        boolean isCurrent,
        String description,
        List<String> highlights,
        List<String> technologies,
        int sortOrder
) {
}
