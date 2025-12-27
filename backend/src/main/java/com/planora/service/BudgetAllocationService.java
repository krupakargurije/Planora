package com.planora.service;

import com.planora.dto.BudgetBreakdownDTO;
import com.planora.entity.BudgetAllocation;
import com.planora.repository.BudgetAllocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BudgetAllocationService {

    private final BudgetAllocationRepository budgetAllocationRepository;

    // Budget allocation percentages for different plan types
    private static final Map<String, Map<String, Double>> ALLOCATION_PERCENTAGES = new HashMap<>() {
        {
            put("BUDGET", Map.of(
                    "travel", 0.40,
                    "accommodation", 0.30,
                    "food", 0.15,
                    "activities", 0.15));
            put("BALANCED", Map.of(
                    "travel", 0.35,
                    "accommodation", 0.35,
                    "food", 0.15,
                    "activities", 0.15));
            put("COMFORT", Map.of(
                    "travel", 0.25,
                    "accommodation", 0.45,
                    "food", 0.15,
                    "activities", 0.15));
        }
    };

    /**
     * Calculate and save budget allocation for a trip
     */
    public BudgetAllocation calculateAndSaveBudgetAllocation(Long tripId, Double totalBudget, String planType) {
        Map<String, Double> percentages = ALLOCATION_PERCENTAGES.get(planType);

        if (percentages == null) {
            throw new IllegalArgumentException("Invalid plan type: " + planType);
        }

        BudgetAllocation allocation = new BudgetAllocation();
        allocation.setTripId(tripId);
        allocation.setTravelBudget(totalBudget * percentages.get("travel"));
        allocation.setAccommodationBudget(totalBudget * percentages.get("accommodation"));
        allocation.setFoodBudget(totalBudget * percentages.get("food"));
        allocation.setActivitiesBudget(totalBudget * percentages.get("activities"));
        allocation.setTotalAllocated(totalBudget);

        return budgetAllocationRepository.save(allocation);
    }

    /**
     * Get budget allocation for a trip
     */
    public BudgetAllocation getBudgetAllocationByTripId(Long tripId) {
        return budgetAllocationRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("Budget allocation not found for trip: " + tripId));
    }

    /**
     * Convert BudgetAllocation entity to DTO with percentages
     */
    public BudgetBreakdownDTO convertToDTO(BudgetAllocation allocation) {
        BudgetBreakdownDTO dto = new BudgetBreakdownDTO();
        dto.setTravelBudget(allocation.getTravelBudget());
        dto.setAccommodationBudget(allocation.getAccommodationBudget());
        dto.setFoodBudget(allocation.getFoodBudget());
        dto.setActivitiesBudget(allocation.getActivitiesBudget());
        dto.setTotalAllocated(allocation.getTotalAllocated());

        // Calculate percentages
        double total = allocation.getTotalAllocated();
        dto.setTravelPercentage((allocation.getTravelBudget() / total) * 100);
        dto.setAccommodationPercentage((allocation.getAccommodationBudget() / total) * 100);
        dto.setFoodPercentage((allocation.getFoodBudget() / total) * 100);
        dto.setActivitiesPercentage((allocation.getActivitiesBudget() / total) * 100);

        return dto;
    }

    /**
     * Get allocation percentages for a plan type (for transparency)
     */
    public Map<String, Double> getAllocationPercentages(String planType) {
        return ALLOCATION_PERCENTAGES.get(planType);
    }

    /**
     * Delete budget allocation for a trip
     */
    public void deleteBudgetAllocationByTripId(Long tripId) {
        budgetAllocationRepository.deleteByTripId(tripId);
    }
}
