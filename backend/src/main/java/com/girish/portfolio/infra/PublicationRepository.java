package com.girish.portfolio.infra;

import com.girish.portfolio.domain.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, UUID> {

    List<Publication> findByIsPublishedTrueOrderBySortOrderAsc();
}
