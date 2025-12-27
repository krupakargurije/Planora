package com.planora.controller;

import com.planora.dto.ApiResponse;
import com.planora.dto.TripRequestDTO;
import com.planora.dto.TripResponseDTO;
import com.planora.entity.User;
import com.planora.repository.UserRepository;
import com.planora.service.TripPlanningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripPlanningService tripPlanningService;
    private final UserRepository userRepository;

    @PostMapping("/plan")
    public ResponseEntity<ApiResponse<TripResponseDTO>> createTripPlan(
            @Valid @RequestBody TripRequestDTO requestDTO,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        TripResponseDTO response = tripPlanningService.createTripPlan(requestDTO, userId);

        return ResponseEntity.ok(ApiResponse.success(response, "Trip plan created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getTripById(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        TripResponseDTO response = tripPlanningService.getTripById(id, userId);

        return ResponseEntity.ok(ApiResponse.success(response, "Trip retrieved successfully"));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getMyTrips(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<TripResponseDTO> trips = tripPlanningService.getUserTrips(userId);

        return ResponseEntity.ok(ApiResponse.success(trips, "Trips retrieved successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        tripPlanningService.deleteTrip(id, userId);

        return ResponseEntity.ok(ApiResponse.success(null, "Trip deleted successfully"));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
