package com.girish.portfolio.api.dto;

import java.math.BigDecimal;

public record PublicSkillItemDto(
        String name,
        String proficiency,
        BigDecimal yearsOfExperience,
        String icon,
        boolean isFeatured
) {
}
