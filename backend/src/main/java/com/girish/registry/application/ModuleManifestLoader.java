package com.girish.registry.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.registry.domain.ModuleManifest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ModuleManifestLoader {

    private static final Logger log = LoggerFactory.getLogger(ModuleManifestLoader.class);
    private static final String MANIFEST_LOCATION_PATTERN = "classpath*:manifests/*.json";

    private final ObjectMapper objectMapper;
    private final ResourcePatternResolver resourcePatternResolver;
    private final Map<String, ModuleManifest> loadedManifests = new ConcurrentHashMap<>();

    public ModuleManifestLoader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.resourcePatternResolver = new PathMatchingResourcePatternResolver();
    }

    public List<ModuleManifest> loadAllManifests() {
        List<ModuleManifest> manifests = new ArrayList<>();
        try {
            Resource[] resources = resourcePatternResolver.getResources(MANIFEST_LOCATION_PATTERN);
            log.info("Discovered {} compile-time module manifest resource(s)", resources.length);

            for (Resource resource : resources) {
                if (!resource.isReadable()) {
                    continue;
                }
                try (InputStream is = resource.getInputStream()) {
                    ModuleManifest manifest = objectMapper.readValue(is, ModuleManifest.class);
                    manifests.add(manifest);
                    loadedManifests.put(manifest.id(), manifest);
                    log.debug("Successfully loaded module manifest: [{}] version {}", manifest.id(), manifest.version());
                } catch (Exception e) {
                    log.error("Failed to parse module manifest from resource: {}", resource.getFilename(), e);
                    throw new IllegalStateException("Invalid module manifest in resource: " + resource.getFilename(), e);
                }
            }
        } catch (IOException e) {
            log.error("Failed to scan for module manifests matching pattern: {}", MANIFEST_LOCATION_PATTERN, e);
            throw new IllegalStateException("Failed to discover module manifests", e);
        }

        return Collections.unmodifiableList(manifests);
    }

    public ModuleManifest getManifest(String moduleId) {
        if (loadedManifests.isEmpty()) {
            loadAllManifests();
        }
        return loadedManifests.get(moduleId);
    }

    public Map<String, ModuleManifest> getLoadedManifests() {
        if (loadedManifests.isEmpty()) {
            loadAllManifests();
        }
        return Collections.unmodifiableMap(loadedManifests);
    }
}
