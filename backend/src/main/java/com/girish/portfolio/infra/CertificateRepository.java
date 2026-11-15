package com.girish.portfolio.infra;

import com.girish.portfolio.domain.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    List<Certificate> findByIsPublishedTrueOrderBySortOrderAsc();
}
