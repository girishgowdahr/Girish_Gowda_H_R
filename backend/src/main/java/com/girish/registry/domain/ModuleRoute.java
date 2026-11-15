package com.girish.registry.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ModuleRoute(
        String path,
        String label,
        String icon,
        boolean isExact,
        boolean requiresAuth,
        String permission
) {
    public ModuleRoute {
        if (path == null || path.isBlank()) {
            throw new IllegalArgumentException("Route path must not be null or blank");
        }
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("Route label must not be null or blank");
        }
    }
}
