-- ============================================
-- Planora Database Schema
-- PostgreSQL / H2 Compatible
-- ============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS budget_allocations CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    provider VARCHAR(20),
    provider_id VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_provider ON users(provider, provider_id);

-- ============================================
-- Table: destinations
-- ============================================
CREATE TABLE destinations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    average_cost_per_day DECIMAL(10, 2),
    best_season VARCHAR(50),
    popular_activities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_cost ON destinations(average_cost_per_day);

-- ============================================
-- Table: trips
-- ============================================
CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    destination_id BIGINT,
    start_city VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_travelers INT NOT NULL,
    travel_type VARCHAR(20) NOT NULL,
    total_budget DECIMAL(10, 2) NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trips_destination ON trips(destination_id);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);

-- ============================================
-- Table: budget_allocations
-- ============================================
CREATE TABLE budget_allocations (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    travel_amount DECIMAL(10, 2) NOT NULL,
    accommodation_amount DECIMAL(10, 2) NOT NULL,
    food_amount DECIMAL(10, 2) NOT NULL,
    activities_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_budget_trip ON budget_allocations(trip_id);

-- ============================================
-- Table: hotels
-- ============================================
CREATE TABLE hotels (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1),
    amenities TEXT,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_hotels_trip ON hotels(trip_id);
CREATE INDEX idx_hotels_price ON hotels(price_per_night);

-- ============================================
-- Table: activities
-- ============================================
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_cost DECIMAL(10, 2),
    duration VARCHAR(50),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_trip ON activities(trip_id);
CREATE INDEX idx_activities_category ON activities(category);
