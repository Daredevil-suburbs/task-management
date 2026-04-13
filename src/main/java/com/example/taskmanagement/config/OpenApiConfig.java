/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
            .info(new Info()
                .title("Hunter System API")
                .version("1.0")
                .description("Solo Leveling-inspired task management API with XP, levels, and hunter ranks.\n\n"
                    + "**Features:** Quest CRUD, XP system, hunter ranks (E→S), achievements, "
                    + "recurring daily quests, subtasks, health tracking, leaderboard, streaks.")
                .contact(new Contact()
                    .name("Hunter System")
                    .email("support@huntersystem.com")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Paste your JWT token here (from /api/auth/login)")));
    }
}
