package com.girish.registry.infra;

import com.girish.registry.domain.ModuleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleStateRepository extends JpaRepository<ModuleState, String> {
    List<ModuleState> findByVisibilityOrderBySortOrderAsc(String visibility);
    List<ModuleState> findByStatusOrderBySortOrderAsc(String status);
}
