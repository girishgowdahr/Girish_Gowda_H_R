package com.girish.registry.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.registry.domain.ModuleManifest;
import com.girish.registry.domain.ModuleState;
import com.girish.registry.infra.ModuleStateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ModuleRegistryReconciliationService implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ModuleRegistryReconciliationService.class);

    private final ModuleManifestLoader manifestLoader;
    private final ModuleStateRepository moduleStateRepository;
    private final ObjectMapper objectMapper;

    public ModuleRegistryReconciliationService(
            ModuleManifestLoader manifestLoader,
            ModuleStateRepository moduleStateRepository,
            ObjectMapper objectMapper
    ) {
        this.manifestLoader = manifestLoader;
        this.moduleStateRepository = moduleStateRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        reconcile();
    }

    @Transactional
    public ReconciliationReport reconcile() {
        log.info("Starting Module Registry reconciliation against compile-time manifests...");

        List<ModuleManifest> manifests = manifestLoader.loadAllManifests();
        Map<String, ModuleManifest> manifestMap = manifests.stream()
                .collect(Collectors.toMap(ModuleManifest::id, m -> m));

        List<ModuleState> existingStates = moduleStateRepository.findAll();
        Map<String, ModuleState> stateMap = existingStates.stream()
                .collect(Collectors.toMap(ModuleState::getModuleId, s -> s));

        int createdCount = 0;
        int restoredCount = 0;
        int orphanedCount = 0;

        // 1. Reconcile compile-time manifests into runtime table
        for (ModuleManifest manifest : manifests) {
            ModuleState state = stateMap.get(manifest.id());
            if (state == null) {
                // Insert new module state
                ModuleState newState = new ModuleState();
                newState.setModuleId(manifest.id());
                newState.setDisplayName(manifest.name());
                newState.setIcon(manifest.icon());
                newState.setNavGroup(manifest.navGroup());
                newState.setSortOrder(manifest.sortOrder());
                newState.setStatus(manifest.status() != null ? manifest.status() : "ENABLED");
                newState.setVisibility(manifest.visibility() != null ? manifest.visibility() : "PRIVATE");
                newState.setAvatarThemeId(manifest.defaultAvatarThemeId());
                newState.setFeatureFlags(serializeFeatureFlags(manifest.featureFlags()));
                newState.setUpdatedAt(OffsetDateTime.now());

                moduleStateRepository.save(newState);
                createdCount++;
                log.info("Registered new module [{}] with status={}", manifest.id(), newState.getStatus());
            } else if ("ORPHANED".equalsIgnoreCase(state.getStatus())) {
                // Revive previously orphaned module
                state.setStatus("ENABLED");
                state.setUpdatedAt(OffsetDateTime.now());
                moduleStateRepository.save(state);
                restoredCount++;
                log.info("Restored previously orphaned module [{}] to ENABLED", manifest.id());
            }
        }

        // 2. Detect orphaned modules in database that no longer have compile-time manifests
        Set<String> manifestIds = manifestMap.keySet();
        for (ModuleState state : existingStates) {
            if (!manifestIds.contains(state.getModuleId()) && !"ORPHANED".equalsIgnoreCase(state.getStatus())) {
                state.setStatus("ORPHANED");
                state.setUpdatedAt(OffsetDateTime.now());
                moduleStateRepository.save(state);
                orphanedCount++;
                log.warn("Module [{}] exists in database but has no code manifest; marked as ORPHANED", state.getModuleId());
            }
        }

        log.info("Module Registry reconciliation completed: {} registered, {} restored, {} orphaned",
                createdCount, restoredCount, orphanedCount);

        return new ReconciliationReport(createdCount, restoredCount, orphanedCount);
    }

    private String serializeFeatureFlags(Map<String, Object> featureFlags) {
        if (featureFlags == null || featureFlags.isEmpty()) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(featureFlags);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize feature flags to JSON string, falling back to empty object", e);
            return "{}";
        }
    }

    public record ReconciliationReport(int created, int restored, int orphaned) {}
}
