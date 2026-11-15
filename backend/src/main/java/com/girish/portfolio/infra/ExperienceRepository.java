package com.girish.portfolio.infra;

import com.girish.portfolio.domain.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    List<Experience> findByIsPublishedTrueOrderBySortOrderAsc();
}
