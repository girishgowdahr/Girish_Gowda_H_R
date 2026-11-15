package com.girish.registry.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ModuleManifest(
        String id,
        String name,
        String description,
        String version,
        String schemaVersion,
        String icon,
        String navGroup,
        int sortOrder,
        String status,
        String visibility,
        String defaultAvatarThemeId,
        List<ModuleRoute> routes,
        List<String> permissions,
        Map<String, Object> featureFlags
) {
    public ModuleManifest {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Module manifest id must not be null or blank");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Module manifest name must not be null or blank");
        }
        if (version == null || version.isBlank()) {
            throw new IllegalArgumentException("Module manifest version must not be null or blank");
        }
        routes = routes != null ? Collections.unmodifiableList(routes) : Collections.emptyList();
        permissions = permissions != null ? Collections.unmodifiableList(permissions) : Collections.emptyList();
        featureFlags = featureFlags != null ? Collections.unmodifiableMap(featureFlags) : Collections.emptyMap();
    }
}
