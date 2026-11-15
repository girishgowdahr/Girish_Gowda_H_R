package com.girish.portfolio.api.dto;

public record PublicEducationDto(
        String institution,
        String degree,
        String fieldOfStudy,
        int startYear,
        Integer endYear,
        String gradeOrGpa,
        String description,
        int sortOrder
) {
}
