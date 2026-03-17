package com.example.taskmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    // ── Hunter System ──────────────────────────────────────
    @Column(nullable = false)
    private int totalXp = 0;

    @Column(nullable = false)
    private int level = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HunterRank hunterRank = HunterRank.E;

    // ── Relationships ──────────────────────────────────────
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks;
}
