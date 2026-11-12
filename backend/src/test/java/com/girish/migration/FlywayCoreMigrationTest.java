package com.girish.migration;

import com.girish.avatar.domain.AvatarTheme;
import com.girish.avatar.infra.AvatarThemeRepository;
import com.girish.registry.domain.ModuleState;
import com.girish.registry.infra.ModuleStateRepository;
import com.girish.security.domain.AppUser;
import com.girish.security.infra.AppUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FlywayCoreMigrationTest {

    @Autowired
    private AvatarThemeRepository avatarThemeRepository;

    @Autowired
    private ModuleStateRepository moduleStateRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    @DisplayName("Flyway baseline migration should seed default avatar themes")
    void shouldSeedDefaultAvatarThemes() {
        List<AvatarTheme> themes = avatarThemeRepository.findAll();
        assertThat(themes).isNotEmpty();
        assertThat(themes).extracting(AvatarTheme::getId)
                .contains("theme-cyber-neon", "theme-tactical-ghost", "theme-crimson-blaze", "theme-void-walker");

        Optional<AvatarTheme> defaultTheme = avatarThemeRepository.findByIsDefaultTrue();
        assertThat(defaultTheme).isPresent();
        assertThat(defaultTheme.get().getId()).isEqualTo("theme-cyber-neon");
        assertThat(defaultTheme.get().getOutfitId()).isEqualTo("cyber-neon");
    }

    @Test
    @DisplayName("Flyway baseline migration should seed core module states")
    void shouldSeedCoreModuleStates() {
        List<ModuleState> modules = moduleStateRepository.findAll();
        assertThat(modules).isNotEmpty();
        assertThat(modules).extracting(ModuleState::getModuleId)
                .contains("lobby", "portfolio", "personal-fitness", "personal-study", "personal-journal", "vault");

        List<ModuleState> publicModules = moduleStateRepository.findByVisibilityOrderBySortOrderAsc("PUBLIC");
        assertThat(publicModules).isNotEmpty();
        assertThat(publicModules).extracting(ModuleState::getModuleId)
                .contains("lobby", "portfolio");
    }

    @Test
    @DisplayName("AppUserRepository should persist and query owner user in core schema")
    void shouldPersistAndQueryAppUser() {
        UUID userId = UUID.randomUUID();
        AppUser owner = new AppUser(
                userId,
                "owner@example.com",
                "Girish Gowda H R",
                "OWNER",
                "ACTIVE",
                OffsetDateTime.now(),
                OffsetDateTime.now()
        );

        appUserRepository.save(owner);

        Optional<AppUser> retrieved = appUserRepository.findByEmail("owner@example.com");
        assertThat(retrieved).isPresent();
        assertThat(retrieved.get().getDisplayName()).isEqualTo("Girish Gowda H R");
        assertThat(retrieved.get().getRole()).isEqualTo("OWNER");
    }
}
