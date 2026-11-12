package com.girish.avatar.infra;

import com.girish.avatar.domain.AvatarTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AvatarThemeRepository extends JpaRepository<AvatarTheme, String> {
    Optional<AvatarTheme> findByIsDefaultTrue();
}
