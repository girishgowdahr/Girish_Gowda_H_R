package com.girish.portfolio.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.girish.portfolio.api.dto.PublicPortfolioSummaryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class PortfolioContentImportService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioContentImportService.class);

    private final ObjectMapper objectMapper;
    private final PublicPortfolioService publicPortfolioService;

    public PortfolioContentImportService(ObjectMapper objectMapper, PublicPortfolioService publicPortfolioService) {
        this.objectMapper = objectMapper;
        this.publicPortfolioService = publicPortfolioService;
    }

    public PublicPortfolioSummaryDto parseAndValidate(InputStream inputStream) throws IOException {
        PublicPortfolioSummaryDto summary = objectMapper.readValue(inputStream, PublicPortfolioSummaryDto.class);
        validateSummary(summary);
        return summary;
    }

    public PublicPortfolioSummaryDto parseAndValidate(String jsonContent) throws IOException {
        PublicPortfolioSummaryDto summary = objectMapper.readValue(jsonContent, PublicPortfolioSummaryDto.class);
        validateSummary(summary);
        return summary;
    }

    public String exportCurrentContentAsJson() throws IOException {
        PublicPortfolioSummaryDto currentSummary = publicPortfolioService.getPortfolioSummary();
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(currentSummary);
    }

    private void validateSummary(PublicPortfolioSummaryDto summary) {
        if (summary == null) {
            throw new IllegalArgumentException("Portfolio summary payload must not be null");
        }
        if (summary.profile() == null || summary.profile().fullName() == null || summary.profile().fullName().isBlank()) {
            throw new IllegalArgumentException("Profile full name is required");
        }
        if (summary.profile().email() == null || summary.profile().email().isBlank()) {
            throw new IllegalArgumentException("Profile email is required");
        }
        log.info("Portfolio content parsed and validated successfully for operator: {}", summary.profile().fullName());
    }
}
