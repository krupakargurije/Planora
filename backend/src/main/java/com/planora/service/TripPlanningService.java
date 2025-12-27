package com.planora.service;

import com.planora.dto.*;
import com.planora.entity.*;
import com.planora.exception.InvalidBudgetException;
import com.planora.exception.ResourceNotFoundException;
import com.planora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripPlanningService {

    private final TripRepository tripRepository;
    private final BudgetAllocationService budgetAllocationService;
    private final DestinationRepository destinationRepository;
    private final HotelRepository hotelRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    /**
     * Create a new trip plan
     */
    @Transactional
    public TripResponseDTO createTripPlan(TripRequestDTO requestDTO, Long userId) {
        // Validate user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Validate budget
        if (requestDTO.getTotalBudget() <= 0) {
            throw new InvalidBudgetException("Budget must be greater than 0");
        }

        // Calculate number of days if not provided
        if (requestDTO.getNumberOfDays() == null) {
            long days = ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getEndDate()) + 1;
            requestDTO.setNumberOfDays((int) days);
        }

        // Create trip entity
        Trip trip = new Trip();
        trip.setUserId(userId);
        trip.setStartCity(requestDTO.getStartCity());
        trip.setStartDate(requestDTO.getStartDate());
        trip.setEndDate(requestDTO.getEndDate());
        trip.setNumberOfDays(requestDTO.getNumberOfDays());
        trip.setNumberOfTravelers(requestDTO.getNumberOfTravelers());
        trip.setTravelType(requestDTO.getTravelType());
        trip.setTotalBudget(requestDTO.getTotalBudget());
        trip.setPlanType(requestDTO.getPlanType());
        trip.setStatus("DRAFT");

        // Find suitable destination based on budget
        Destination destination = findSuitableDestination(requestDTO.getTotalBudget(), requestDTO.getNumberOfDays());
        if (destination != null) {
            trip.setDestinationId(destination.getId());
        }

        Trip savedTrip = tripRepository.save(trip);

        // Calculate budget allocation
        BudgetAllocation budgetAllocation = budgetAllocationService.calculateAndSaveBudgetAllocation(
                savedTrip.getId(),
                savedTrip.getTotalBudget(),
                savedTrip.getPlanType());

        // Generate recommendations (mock data for now)
        List<Hotel> hotels = generateHotelRecommendations(savedTrip, budgetAllocation);
        List<Activity> activities = generateActivityRecommendations(savedTrip, budgetAllocation);

        // Convert to response DTO
        return convertToResponseDTO(savedTrip, destination, budgetAllocation, hotels, activities);
    }

    /**
     * Get trip by ID
     */
    public TripResponseDTO getTripById(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        // Verify trip belongs to user
        if (!trip.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to trip");
        }

        Destination destination = trip.getDestinationId() != null
                ? destinationRepository.findById(trip.getDestinationId()).orElse(null)
                : null;

        BudgetAllocation budgetAllocation = budgetAllocationService.getBudgetAllocationByTripId(tripId);
        List<Hotel> hotels = hotelRepository.findByTripId(tripId);
        List<Activity> activities = activityRepository.findByTripId(tripId);

        return convertToResponseDTO(trip, destination, budgetAllocation, hotels, activities);
    }

    /**
     * Get all trips for a user
     */
    public List<TripResponseDTO> getUserTrips(Long userId) {
        List<Trip> trips = tripRepository.findByUserId(userId);

        return trips.stream()
                .map(trip -> {
                    Destination destination = trip.getDestinationId() != null
                            ? destinationRepository.findById(trip.getDestinationId()).orElse(null)
                            : null;
                    BudgetAllocation budgetAllocation = budgetAllocationService
                            .getBudgetAllocationByTripId(trip.getId());
                    List<Hotel> hotels = hotelRepository.findByTripId(trip.getId());
                    List<Activity> activities = activityRepository.findByTripId(trip.getId());

                    return convertToResponseDTO(trip, destination, budgetAllocation, hotels, activities);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete a trip
     */
    @Transactional
    public void deleteTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        // Verify trip belongs to user
        if (!trip.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this trip");
        }

        // Delete associated data (cascade should handle this, but being explicit)
        hotelRepository.deleteByTripId(tripId);
        activityRepository.deleteByTripId(tripId);
        budgetAllocationService.deleteBudgetAllocationByTripId(tripId);

        // Delete the trip
        tripRepository.delete(trip);
    }

    /**
     * Find suitable destination based on budget
     */
    private Destination findSuitableDestination(Double totalBudget, Integer numberOfDays) {
        double budgetPerDay = totalBudget / numberOfDays;
        List<Destination> destinations = destinationRepository.findByAverageCostLessThanEqual(budgetPerDay * 0.8);

        return destinations.isEmpty() ? null : destinations.get(0);
    }

    /**
     * Generate hotel recommendations (mock data for MVP)
     */
    private List<Hotel> generateHotelRecommendations(Trip trip, BudgetAllocation budgetAllocation) {
        List<Hotel> hotels = new ArrayList<>();
        double maxPricePerNight = budgetAllocation.getAccommodationBudget() / trip.getNumberOfDays();

        // Mock hotel data
        Hotel hotel1 = new Hotel();
        hotel1.setTripId(trip.getId());
        hotel1.setName("Comfort Inn");
        hotel1.setLocation(trip.getStartCity());
        hotel1.setPricePerNight(maxPricePerNight * 0.7);
        hotel1.setRating(4.0);
        hotel1.setAmenities("[\"WiFi\", \"Breakfast\", \"Pool\"]");
        hotels.add(hotelRepository.save(hotel1));

        Hotel hotel2 = new Hotel();
        hotel2.setTripId(trip.getId());
        hotel2.setName("Grand Plaza Hotel");
        hotel2.setLocation(trip.getStartCity());
        hotel2.setPricePerNight(maxPricePerNight * 0.9);
        hotel2.setRating(4.5);
        hotel2.setAmenities("[\"WiFi\", \"Breakfast\", \"Gym\", \"Spa\"]");
        hotels.add(hotelRepository.save(hotel2));

        return hotels;
    }

    /**
     * Generate activity recommendations (mock data for MVP)
     */
    private List<Activity> generateActivityRecommendations(Trip trip, BudgetAllocation budgetAllocation) {
        List<Activity> activities = new ArrayList<>();
        double activityBudget = budgetAllocation.getActivitiesBudget();

        // Mock activity data
        Activity activity1 = new Activity();
        activity1.setTripId(trip.getId());
        activity1.setName("City Tour");
        activity1.setDescription("Explore the city's main attractions");
        activity1.setCost(activityBudget * 0.3);
        activity1.setDurationHours(4);
        activity1.setCategory("SIGHTSEEING");
        activities.add(activityRepository.save(activity1));

        Activity activity2 = new Activity();
        activity2.setTripId(trip.getId());
        activity2.setName("Local Food Experience");
        activity2.setDescription("Taste authentic local cuisine");
        activity2.setCost(activityBudget * 0.25);
        activity2.setDurationHours(3);
        activity2.setCategory("FOOD");
        activities.add(activityRepository.save(activity2));

        Activity activity3 = new Activity();
        activity3.setTripId(trip.getId());
        activity3.setName("Adventure Activity");
        activity3.setDescription("Exciting outdoor adventure");
        activity3.setCost(activityBudget * 0.35);
        activity3.setDurationHours(5);
        activity3.setCategory("ADVENTURE");
        activities.add(activityRepository.save(activity3));

        return activities;
    }

    /**
     * Convert entities to response DTO
     */
    private TripResponseDTO convertToResponseDTO(Trip trip, Destination destination,
            BudgetAllocation budgetAllocation,
            List<Hotel> hotels, List<Activity> activities) {
        TripResponseDTO response = new TripResponseDTO();
        response.setTripId(trip.getId());
        response.setStartCity(trip.getStartCity());
        response.setDestinationName(destination != null ? destination.getName() : "To be determined");
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setNumberOfDays(trip.getNumberOfDays());
        response.setNumberOfTravelers(trip.getNumberOfTravelers());
        response.setTravelType(trip.getTravelType());
        response.setTotalBudget(trip.getTotalBudget());
        response.setPlanType(trip.getPlanType());
        response.setStatus(trip.getStatus());

        // Budget breakdown
        response.setBudgetBreakdown(budgetAllocationService.convertToDTO(budgetAllocation));

        // Hotels
        response.setHotels(hotels.stream()
                .map(h -> new HotelDTO(h.getId(), h.getName(), h.getLocation(),
                        h.getPricePerNight(), h.getRating(), h.getAmenities(), h.getImageUrl()))
                .collect(Collectors.toList()));

        // Activities
        response.setActivities(activities.stream()
                .map(a -> new ActivityDTO(a.getId(), a.getName(), a.getDescription(),
                        a.getCost(), a.getDurationHours(), a.getCategory(), a.getImageUrl()))
                .collect(Collectors.toList()));

        return response;
    }
}
