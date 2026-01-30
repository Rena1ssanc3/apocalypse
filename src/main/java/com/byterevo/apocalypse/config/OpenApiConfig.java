package com.byterevo.apocalypse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Apocalypse API")
                        .version("1.0.0")
                        .description("API documentation for Apocalypse Spring Boot application")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@example.com")));
    }
}
