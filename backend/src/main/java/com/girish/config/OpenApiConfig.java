package com.girish.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI girishOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GIRISH Platform API")
                        .description("REST API for GIRISH Personal Identity Platform, Portfolio, and Quantified-Self Monolith.")
                        .version("0.1.0")
                        .contact(new Contact()
                                .name("Girish")
                                .url("https://github.com"))
                        .license(new License()
                                .name("Proprietary - All Rights Reserved")));
    }
}
