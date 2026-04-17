/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.OnboardingDTO;
import com.example.taskmanagement.service.OnboardingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    /**
     * POST /api/onboarding/awaken
     * Accepts user's class name, debuffs, and main goal, then generates
     * personalized onboarding tasks using an LLM.
     */
    @PostMapping("/awaken")
    public ResponseEntity<OnboardingDTO.AwakenResponse> awaken(
            @Valid @RequestBody OnboardingDTO.AwakenRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        OnboardingDTO.AwakenResponse response = onboardingService.awakenUser(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
