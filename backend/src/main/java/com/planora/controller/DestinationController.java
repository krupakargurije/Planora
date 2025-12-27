package com.planora.controller;

import com.planora.dto.ApiResponse;
import com.planora.entity.Destination;
import com.planora.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DestinationController {

    private final DestinationRepository destinationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> getAllDestinations() {
        List<String> destinationNames = destinationRepository.findAll()
                .stream()
                .map(Destination::getName)
                .sorted()
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(destinationNames, "Destinations retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<String>>> searchDestinations(@RequestParam String query) {
        List<String> matchingDestinations = destinationRepository.findAll()
                .stream()
                .map(Destination::getName)
                .filter(name -> name.toLowerCase().contains(query.toLowerCase()))
                .sorted()
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(matchingDestinations, "Search completed"));
    }
}
