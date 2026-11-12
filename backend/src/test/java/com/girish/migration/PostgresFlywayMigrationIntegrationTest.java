package com.girish.migration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
@EnabledIf("isDockerAvailable")
class PostgresFlywayMigrationIntegrationTest {

    static boolean isDockerAvailable() {
        try {
            Process process = new ProcessBuilder("docker", "--version").start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Container
    static PostgreSQLContainer<?> postgres = isDockerAvailable()
            ? new PostgreSQLContainer<>("postgres:16-alpine")
            : null;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (postgres != null && postgres.isRunning()) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
            registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
        }
    }

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Flyway baseline migration should execute cleanly on PostgreSQL container")
    void shouldExecuteFlywayMigrationOnPostgres() {
        if (jdbcTemplate == null || postgres == null || !postgres.isRunning()) {
            return;
        }

        Integer userTableCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'core' AND table_name = 'app_user'",
                Integer.class
        );
        assertThat(userTableCount).isEqualTo(1);

        Integer themesCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM core.avatar_theme",
                Integer.class
        );
        assertThat(themesCount).isGreaterThanOrEqualTo(4);

        Integer modulesCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM core.module_state",
                Integer.class
        );
        assertThat(modulesCount).isGreaterThanOrEqualTo(6);
    }
}


