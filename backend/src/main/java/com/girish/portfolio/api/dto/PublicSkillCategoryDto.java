package com.girish.portfolio.api.dto;

import java.util.List;

public record PublicSkillCategoryDto(
        String name,
        int sortOrder,
        List<PublicSkillItemDto> items
) {
}
