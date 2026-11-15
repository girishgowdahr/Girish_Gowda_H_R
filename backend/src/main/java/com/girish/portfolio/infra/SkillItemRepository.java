package com.girish.portfolio.infra;

import com.girish.portfolio.domain.SkillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillItemRepository extends JpaRepository<SkillItem, UUID> {
    List<SkillItem> findByIsFeaturedTrueOrderBySortOrderAsc();
    List<SkillItem> findByCategoryIdOrderBySortOrderAsc(UUID categoryId);
}
