package com.planora.controller;

import com.planora.dto.ApiResponse;
import com.planora.dto.AuthResponseDTO;
import com.planora.dto.LoginRequestDTO;
import com.planora.dto.UserRegistrationDTO;
import com.planora.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(
            @Valid 
            @RequestBody UserRegistrationDTO registrationDTO) {
        AuthResponseDTO response = authenticationService.register(registrationDTO);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        AuthResponseDTO response = authenticationService.login(loginDTO);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
}
