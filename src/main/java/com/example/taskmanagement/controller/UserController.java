package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.UserStatusDTO;
import com.example.taskmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/user/status — Hunter status panel
    @GetMapping("/status")
    public ResponseEntity<UserStatusDTO> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getStatus(userDetails.getUsername()));
    }
}
