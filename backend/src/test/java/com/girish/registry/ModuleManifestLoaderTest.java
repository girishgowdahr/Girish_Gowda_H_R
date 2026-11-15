package com.girish.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.registry.application.ModuleManifestLoader;
import com.girish.registry.domain.ModuleManifest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ModuleManifestLoaderTest {

    private ModuleManifestLoader loader;

    @BeforeEach
    void setUp() {
        loader = new ModuleManifestLoader(new ObjectMapper());
    }

    @Test
    @DisplayName("Should successfully load all compile-time module manifests from classpath")
    void shouldLoadAllManifests() {
        List<ModuleManifest> manifests = loader.loadAllManifests();

        assertThat(manifests).isNotEmpty();
        assertThat(manifests).hasSizeGreaterThanOrEqualTo(6);

        // Verify key modules are present
        assertThat(manifests).extracting(ModuleManifest::id)
                .contains("lobby", "portfolio", "personal-fitness", "personal-study", "personal-journal", "vault");

        // Verify each manifest has required metadata
        for (ModuleManifest manifest : manifests) {
            assertThat(manifest.id()).isNotBlank();
            assertThat(manifest.name()).isNotBlank();
            assertThat(manifest.version()).isNotBlank();
            assertThat(manifest.schemaVersion()).isNotBlank();
            assertThat(manifest.navGroup()).isIn("primary", "personal", "security", "admin");
            assertThat(manifest.routes()).isNotNull();
            assertThat(manifest.permissions()).isNotNull();
        }
    }

    @Test
    @DisplayName("Should retrieve specific module manifest by ID")
    void shouldGetManifestById() {
        ModuleManifest portfolio = loader.getManifest("portfolio");

        assertThat(portfolio).isNotNull();
        assertThat(portfolio.id()).isEqualTo("portfolio");
        assertThat(portfolio.visibility()).isEqualTo("PUBLIC");
        assertThat(portfolio.routes()).isNotEmpty();
        assertThat(portfolio.routes()).extracting("path")
                .contains("/about", "/skills", "/projects", "/education", "/experience");
    }
}
