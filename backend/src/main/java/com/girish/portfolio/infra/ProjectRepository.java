package com.girish.portfolio.infra;

import com.girish.portfolio.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByIsPublishedTrueOrderBySortOrderAsc();
    List<Project> findByIsPublishedTrueAndFeaturedTrueOrderBySortOrderAsc();
    Optional<Project> findBySlugAndIsPublishedTrue(String slug);
}
