package com.girish.personal.infra;

import com.girish.personal.domain.PersonalBio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonalBioRepository extends JpaRepository<PersonalBio, UUID> {
    List<PersonalBio> findByUserIdOrderByCategoryAscSortOrderAsc(UUID userId);
    List<PersonalBio> findByUserIdAndCategoryOrderBySortOrderAsc(UUID userId, String category);
    Optional<PersonalBio> findByUserIdAndCategoryAndFieldKey(UUID userId, String category, String fieldKey);
    void deleteByUserIdAndCategoryAndFieldKey(UUID userId, String category, String fieldKey);

    @Query("SELECT b FROM PersonalBio b WHERE b.userId = :userId AND " +
           "(LOWER(b.fieldLabel) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.fieldValue) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY b.category ASC, b.sortOrder ASC")
    List<PersonalBio> searchByUserIdAndQuery(@Param("userId") UUID userId, @Param("query") String query);
}
