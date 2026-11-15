package com.girish.portfolio.infra;

import com.girish.portfolio.domain.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {
    @Query("SELECT DISTINCT sc FROM SkillCategory sc LEFT JOIN FETCH sc.items item ORDER BY sc.sortOrder ASC")
    List<SkillCategory> findAllWithItemsOrderBySortOrderAsc();
}
