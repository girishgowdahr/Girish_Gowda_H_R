package com.girish.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.registry.application.ModuleManifestLoader;
import com.girish.registry.application.ModuleRegistryReconciliationService;
import com.girish.registry.domain.ModuleManifest;
import com.girish.registry.domain.ModuleRoute;
import com.girish.registry.domain.ModuleState;
import com.girish.registry.infra.ModuleStateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ModuleRegistryReconciliationServiceTest {

    @Mock
    private ModuleManifestLoader manifestLoader;

    @Mock
    private ModuleStateRepository moduleStateRepository;

    private ModuleRegistryReconciliationService service;

    @BeforeEach
    void setUp() {
        service = new ModuleRegistryReconciliationService(manifestLoader, moduleStateRepository, new ObjectMapper());
    }

    @Test
    @DisplayName("Should insert new module states when manifests exist in code but not in database")
    void shouldRegisterNewModulesFromManifests() {
        ModuleManifest manifest = new ModuleManifest(
                "custom-module",
                "Custom Module",
                "Test description",
                "1.0.0",
                "1.0.0",
                "Activity",
                "personal",
                99,
                "ENABLED",
                "PRIVATE",
                "theme-cyber-neon",
                List.of(new ModuleRoute("/app/custom", "Custom", "Activity", true, true, "OWNER_READ")),
                List.of("OWNER_READ"),
                Collections.emptyMap()
        );

        when(manifestLoader.loadAllManifests()).thenReturn(List.of(manifest));
        when(moduleStateRepository.findAll()).thenReturn(Collections.emptyList());

        var report = service.reconcile();

        assertThat(report.created()).isEqualTo(1);
        assertThat(report.restored()).isEqualTo(0);
        assertThat(report.orphaned()).isEqualTo(0);

        ArgumentCaptor<ModuleState> captor = ArgumentCaptor.forClass(ModuleState.class);
        verify(moduleStateRepository).save(captor.capture());
        ModuleState saved = captor.getValue();
        assertThat(saved.getModuleId()).isEqualTo("custom-module");
        assertThat(saved.getDisplayName()).isEqualTo("Custom Module");
        assertThat(saved.getStatus()).isEqualTo("ENABLED");
    }

    @Test
    @DisplayName("Should mark module as ORPHANED when present in database but missing from code manifests")
    void shouldMarkOrphanedModules() {
        ModuleState legacyModule = new ModuleState(
                "removed-legacy-module",
                "Legacy Module",
                "Archive",
                "primary",
                99,
                "ENABLED",
                "PUBLIC",
                null,
                "{}",
                OffsetDateTime.now()
        );

        when(manifestLoader.loadAllManifests()).thenReturn(Collections.emptyList());
        when(moduleStateRepository.findAll()).thenReturn(List.of(legacyModule));

        var report = service.reconcile();

        assertThat(report.created()).isEqualTo(0);
        assertThat(report.restored()).isEqualTo(0);
        assertThat(report.orphaned()).isEqualTo(1);

        ArgumentCaptor<ModuleState> captor = ArgumentCaptor.forClass(ModuleState.class);
        verify(moduleStateRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo("ORPHANED");
    }

    @Test
    @DisplayName("Should restore previously ORPHANED module to ENABLED when its manifest reappears")
    void shouldRestoreOrphanedModule() {
        ModuleState orphanedState = new ModuleState(
                "restored-module",
                "Restored Module",
                "Activity",
                "personal",
                30,
                "ORPHANED",
                "PRIVATE",
                null,
                "{}",
                OffsetDateTime.now()
        );

        ModuleManifest manifest = new ModuleManifest(
                "restored-module",
                "Restored Module",
                "Desc",
                "1.0.0",
                "1.0.0",
                "Activity",
                "personal",
                30,
                "ENABLED",
                "PRIVATE",
                null,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyMap()
        );

        when(manifestLoader.loadAllManifests()).thenReturn(List.of(manifest));
        when(moduleStateRepository.findAll()).thenReturn(List.of(orphanedState));

        var report = service.reconcile();

        assertThat(report.created()).isEqualTo(0);
        assertThat(report.restored()).isEqualTo(1);
        assertThat(report.orphaned()).isEqualTo(0);

        ArgumentCaptor<ModuleState> captor = ArgumentCaptor.forClass(ModuleState.class);
        verify(moduleStateRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo("ENABLED");
    }
}
