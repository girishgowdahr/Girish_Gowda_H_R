package com.girish.portfolio.api.dto;

import java.util.List;

public record PublicProjectDto(
        String slug,
        String title,
        String tagline,
        String description,
        String category,
        List<String> technologies,
        String githubUrl,
        String liveUrl,
        String demoUrl,
        boolean featured,
        int sortOrder
) {
}
