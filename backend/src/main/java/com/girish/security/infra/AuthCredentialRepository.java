package com.girish.security.infra;

import com.girish.security.domain.AuthCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthCredentialRepository extends JpaRepository<AuthCredential, UUID> {
    Optional<AuthCredential> findByUserIdAndCredentialType(UUID userId, String credentialType);
    List<AuthCredential> findByUserId(UUID userId);
    Optional<AuthCredential> findFirstByCredentialType(String credentialType);
}
