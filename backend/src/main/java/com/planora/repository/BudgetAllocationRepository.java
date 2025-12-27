package com.planora.repository;

import com.planora.entity.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetAllocationRepository extends JpaRepository<BudgetAllocation, Long> {

    Optional<BudgetAllocation> findByTripId(Long tripId);

    void deleteByTripId(Long tripId);
}
