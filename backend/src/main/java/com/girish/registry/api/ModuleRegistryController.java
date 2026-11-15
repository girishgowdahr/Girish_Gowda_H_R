package com.girish.registry.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.registry.api.dto.PublicModuleDto;
import com.girish.registry.application.ModuleManifestLoader;
import com.girish.registry.domain.ModuleManifest;
import com.girish.registry.domain.ModuleRoute;
import com.girish.registry.domain.ModuleState;
import com.girish.registry.infra.ModuleStateRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/modules")
@Tag(name = "Public Module Registry", description = "Public navigation and module discovery APIs")
public class ModuleRegistryController {

    private final ModuleStateRepository moduleStateRepository;
    private final ModuleManifestLoader manifestLoader;
    private final ObjectMapper objectMapper;

    public ModuleRegistryController(
            ModuleStateRepository moduleStateRepository,
            ModuleManifestLoader manifestLoader,
            ObjectMapper objectMapper
    ) {
        this.moduleStateRepository = moduleStateRepository;
        this.manifestLoader = manifestLoader;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @Operation(summary = "List public modules", description = "Returns all published, publicly accessible navigation modules and routes")
    public ResponseEntity<List<PublicModuleDto>> getPublicModules(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        List<ModuleState> publicStates = moduleStateRepository.findByVisibilityOrderBySortOrderAsc("PUBLIC")
                .stream()
                .filter(state -> "ENABLED".equalsIgnoreCase(state.getStatus()))
                .toList();

        List<PublicModuleDto> dtos = new ArrayList<>();
        for (ModuleState state : publicStates) {
            ModuleManifest manifest = manifestLoader.getManifest(state.getModuleId());
            List<ModuleRoute> publicRoutes = Collections.emptyList();
            if (manifest != null && manifest.routes() != null) {
                publicRoutes = manifest.routes().stream()
                        .filter(route -> !route.requiresAuth())
                        .toList();
            }

            Map<String, Object> featureFlags = parseFeatureFlags(state.getFeatureFlags());

            dtos.add(new PublicModuleDto(
                    state.getModuleId(),
                    state.getDisplayName(),
                    state.getIcon(),
                    state.getNavGroup(),
                    state.getSortOrder(),
                    state.getAvatarThemeId(),
                    publicRoutes,
                    featureFlags
            ));
        }

        // Generate ETag from payload string representation
        String jsonPayload = serializeDto(dtos);
        String etag = "\"" + DigestUtils.md5DigestAsHex(jsonPayload.getBytes(StandardCharsets.UTF_8)) + "\"";

        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .eTag(etag)
                    .cacheControl(CacheControl.maxAge(Duration.ofSeconds(60)).cachePublic())
                    .build();
        }

        return ResponseEntity.ok()
                .eTag(etag)
                .cacheControl(CacheControl.maxAge(Duration.ofSeconds(60)).cachePublic())
                .body(dtos);
    }

    private Map<String, Object> parseFeatureFlags(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private String serializeDto(List<PublicModuleDto> dtos) {
        try {
            return objectMapper.writeValueAsString(dtos);
        } catch (Exception e) {
            return dtos.toString();
        }
    }
}
