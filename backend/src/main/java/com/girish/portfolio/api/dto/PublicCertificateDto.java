package com.girish.portfolio.api.dto;

import java.time.LocalDate;

public record PublicCertificateDto(
        String name,
        String issuingOrganization,
        LocalDate issueDate,
        LocalDate expirationDate,
        String credentialId,
        String credentialUrl,
        int sortOrder
) {
}
