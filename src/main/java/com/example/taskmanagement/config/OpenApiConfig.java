package com.example.taskmanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Hunter System API")
                .version("1.0")
                .description("Solo Leveling-inspired task management API with XP, levels, and hunter ranks")
                .contact(new Contact()
                    .name("Hunter System")
                    .email("support@huntersystem.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
            .schemaRequirement("Bearer Authentication", new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT token for authentication"));
    }
}
