package com.byterevo.apocalypse.controller;

import com.byterevo.apocalypse.dto.AuthResponse;
import com.byterevo.apocalypse.dto.LoginRequest;
import com.byterevo.apocalypse.dto.LoginResponse;
import com.byterevo.apocalypse.model.User;
import com.byterevo.apocalypse.repository.UserRepository;
import com.byterevo.apocalypse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@Tag(name = "Authentication", description = "Authentication API endpoints")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return token")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Validate credentials against database
        Optional<com.byterevo.apocalypse.entity.User> userEntityOpt = userRepository.findByUsername(request.getUsername());

        if (userEntityOpt.isEmpty()) {
            // User not found - return 401 without revealing user existence
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        com.byterevo.apocalypse.entity.User userEntity = userEntityOpt.get();

        // Check if user is enabled
        if (!userEntity.getEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Validate password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), userEntity.getPassword())) {
            // Invalid password - return 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Authentication successful - generate token
        String token = authService.createToken(userEntity);
        User user = new User(userEntity.getId(), userEntity.getUsername(),
                userEntity.getEmail() != null ? userEntity.getEmail() : userEntity.getUsername() + "@example.com",
                userEntity.getIsSuperuser());

        LoginResponse response = new LoginResponse(token, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate user token")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.deleteToken(token);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get authenticated user information")
    public ResponseEntity<AuthResponse> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        Optional<com.byterevo.apocalypse.entity.User> userEntityOpt = authService.getUserByToken(token);

        if (userEntityOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        com.byterevo.apocalypse.entity.User userEntity = userEntityOpt.get();
        User user = new User(userEntity.getId(), userEntity.getUsername(),
                userEntity.getEmail() != null ? userEntity.getEmail() : userEntity.getUsername() + "@example.com",
                userEntity.getIsSuperuser());

        AuthResponse response = new AuthResponse(user);
        return ResponseEntity.ok(response);
    }
}
