package com.girish.portfolio.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(20)
public class PortfolioContentReconciliationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(PortfolioContentReconciliationRunner.class);

    private final PortfolioContentImportService importService;

    public PortfolioContentReconciliationRunner(PortfolioContentImportService importService) {
        this.importService = importService;
    }

    @Override
    public void run(ApplicationArguments args) {
        log.info("Starting Portfolio Content Reconciliation Runner...");
        boolean imported = importService.importDefaultContentFileIfPresent();
        if (imported) {
            log.info("Portfolio content successfully reconciled with verified owner resume dataset.");
        } else {
            log.info("No default content dataset found; existing database state preserved.");
        }
    }
}
