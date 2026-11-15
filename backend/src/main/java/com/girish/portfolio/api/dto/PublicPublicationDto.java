package com.girish.portfolio.api.dto;

public record PublicPublicationDto(
    String id,
    String title,
    String publisher,
    String year,
    String state,
    String role,
    String abstractSummary,
    String doi,
    String url,
    String conference
) {}
