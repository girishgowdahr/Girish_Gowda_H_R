package com.girish.portfolio.api.dto;

public record PublicProfileDto(
        String fullName,
        String headline,
        String bio,
        String location,
        String email,
        String githubUrl,
        String linkedinUrl,
        String resumeUrl,
        String avatarImageUrl
) {
}
