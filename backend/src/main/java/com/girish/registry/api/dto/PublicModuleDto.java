package com.girish.registry.api.dto;

import com.girish.registry.domain.ModuleRoute;

import java.util.List;
import java.util.Map;

public record PublicModuleDto(
        String moduleId,
        String displayName,
        String icon,
        String navGroup,
        int sortOrder,
        String avatarThemeId,
        List<ModuleRoute> routes,
        Map<String, Object> featureFlags
) {
}
