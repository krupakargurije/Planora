-- ============================================
-- Planora Complete Database Setup
-- Run this file to create all tables and insert sample data
-- Compatible with PostgreSQL and H2
-- ============================================

-- ============================================
-- PART 1: DROP EXISTING TABLES (Clean Setup)
-- ============================================
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS budget_allocations CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- PART 2: CREATE TABLES
-- ============================================

-- Table: users
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

-- Table: destinations
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

-- Table: trips
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

-- Table: budget_allocations
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

-- Table: hotels
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

-- Table: activities
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

-- ============================================
-- PART 3: INSERT SAMPLE DATA
-- ============================================

-- Sample Users (Password: password123 for all)
INSERT INTO users (username, email, password, role, provider, provider_id, image_url) VALUES
('john_doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NULL, NULL, NULL),
('jane_smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', NULL, NULL, NULL),
('admin_user', 'admin@planora.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NULL, NULL, NULL);

-- Sample Destinations
INSERT INTO destinations (name, country, description, image_url, average_cost_per_day, best_season, popular_activities) VALUES
('Goa', 'India', 'Beautiful beaches, Portuguese heritage, vibrant nightlife, and water sports paradise.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2', 3000.00, 'November to February', 'Beach activities, Water sports, Nightlife, Heritage tours'),
('Jaipur', 'India', 'The Pink City - Historic forts, palaces, rich culture, and traditional handicrafts.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41', 2500.00, 'October to March', 'Fort visits, Palace tours, Shopping, Cultural shows'),
('Kerala', 'India', 'Gods Own Country - Backwaters, hill stations, beaches, and Ayurvedic treatments.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', 3500.00, 'September to March', 'Houseboat cruise, Ayurveda, Beach relaxation, Wildlife'),
('Manali', 'India', 'Himalayan paradise with snow-capped mountains, adventure sports, and scenic beauty.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 2800.00, 'October to June', 'Trekking, Skiing, Paragliding, Temple visits'),
('Udaipur', 'India', 'City of Lakes - Romantic palaces, lakes, rich history, and stunning architecture.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5', 2700.00, 'September to March', 'Palace tours, Boat rides, Cultural shows, Shopping'),
('Rishikesh', 'India', 'Yoga capital of the world - Spiritual retreats, adventure sports, and Ganges river.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 2000.00, 'September to November, March to May', 'Yoga, Rafting, Bungee jumping, Temple visits'),
('Varanasi', 'India', 'Spiritual capital - Ancient temples, Ganges ghats, rich culture and traditions.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc', 1800.00, 'October to March', 'Ganga Aarti, Temple visits, Boat rides, Cultural tours'),
('Andaman Islands', 'India', 'Tropical paradise - Pristine beaches, coral reefs, water sports, and marine life.', 'https://images.unsplash.com/photo-1589197331516-6c0c2b0f5b7f', 4500.00, 'October to May', 'Scuba diving, Snorkeling, Beach activities, Island hopping'),
('Shimla', 'India', 'Queen of Hills - Colonial architecture, scenic views, pleasant climate, and toy train.', 'https://images.unsplash.com/photo-1605649487212-47bdab064df7', 2600.00, 'March to June, December to February', 'Toy train ride, Mall Road, Adventure sports, Sightseeing'),
('Agra', 'India', 'Home of Taj Mahal - Mughal architecture, historic monuments, and rich heritage.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523', 2200.00, 'October to March', 'Taj Mahal, Agra Fort, Shopping, Heritage walks'),
('Ladakh', 'India', 'Land of high passes - Stunning landscapes, monasteries, adventure, and unique culture.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 3800.00, 'May to September', 'Biking, Trekking, Monastery visits, Photography'),
('Munnar', 'India', 'Hill station paradise - Tea plantations, misty mountains, wildlife, and waterfalls.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', 2400.00, 'September to May', 'Tea estate tours, Trekking, Wildlife safari, Boating'),
('Darjeeling', 'India', 'Queen of the Himalayas - Tea gardens, toy train, mountain views, and colonial charm.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 2300.00, 'March to May, October to December', 'Toy train, Tea gardens, Tiger Hill, Monastery visits'),
('Mysore', 'India', 'City of Palaces - Royal heritage, silk sarees, sandalwood, and yoga.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220', 2100.00, 'October to February', 'Palace tours, Yoga, Shopping, Cultural shows'),
('Hampi', 'India', 'UNESCO World Heritage Site - Ancient ruins, temples, boulders, and history.', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24', 1900.00, 'October to February', 'Temple visits, Rock climbing, Cycling, Photography');

-- Sample Trips
INSERT INTO trips (user_id, destination_id, start_city, start_date, end_date, number_of_travelers, travel_type, total_budget, plan_type) VALUES
(1, 1, 'Mumbai', '2025-02-15', '2025-02-20', 2, 'COUPLE', 50000.00, 'BALANCED'),
(1, 3, 'Bangalore', '2025-03-10', '2025-03-15', 4, 'FAMILY', 80000.00, 'COMFORT'),
(2, 2, 'Delhi', '2025-01-25', '2025-01-28', 1, 'SOLO', 25000.00, 'BUDGET');

-- Sample Budget Allocations
INSERT INTO budget_allocations (trip_id, travel_amount, accommodation_amount, food_amount, activities_amount) VALUES
(1, 17500.00, 17500.00, 7500.00, 7500.00),  -- Balanced: 35-35-15-15
(2, 20000.00, 36000.00, 12000.00, 12000.00), -- Comfort: 25-45-15-15
(3, 10000.00, 7500.00, 3750.00, 3750.00);    -- Budget: 40-30-15-15

-- Sample Hotels
INSERT INTO hotels (trip_id, name, price_per_night, rating, amenities, location) VALUES
-- Hotels for Trip 1 (Goa)
(1, 'Taj Exotica Resort & Spa', 8500.00, 4.8, 'Pool, Spa, Beach access, Restaurant, WiFi', 'Benaulim, South Goa'),
(1, 'The Leela Goa', 7500.00, 4.7, 'Pool, Spa, Golf course, Multiple restaurants', 'Cavelossim, South Goa'),
(1, 'Alila Diwa Goa', 6500.00, 4.6, 'Pool, Spa, Beach shuttle, Restaurant', 'Majorda, South Goa'),
-- Hotels for Trip 2 (Kerala)
(2, 'Kumarakom Lake Resort', 9000.00, 4.9, 'Ayurveda spa, Pool, Lake view, Restaurant', 'Kumarakom'),
(2, 'Coconut Lagoon', 7800.00, 4.7, 'Heritage villa, Pool, Backwater access', 'Kumarakom'),
(2, 'Vivanta by Taj', 8200.00, 4.8, 'Pool, Spa, Multiple restaurants, Lake view', 'Kumarakom'),
-- Hotels for Trip 3 (Jaipur)
(3, 'The Oberoi Rajvilas', 6500.00, 4.9, 'Pool, Spa, Heritage property, Restaurant', 'Jaipur'),
(3, 'Rambagh Palace', 7000.00, 4.8, 'Heritage palace, Pool, Spa, Fine dining', 'Jaipur'),
(3, 'Samode Haveli', 5500.00, 4.6, 'Heritage haveli, Pool, Traditional decor', 'Jaipur');

-- Sample Activities
INSERT INTO activities (trip_id, name, description, estimated_cost, duration, category) VALUES
-- Activities for Trip 1 (Goa)
(1, 'Scuba Diving', 'Explore underwater marine life at Grande Island', 3500.00, '4 hours', 'Water Sports'),
(1, 'Dolphin Watching', 'Boat trip to spot playful dolphins', 1500.00, '2 hours', 'Wildlife'),
(1, 'Spice Plantation Tour', 'Visit traditional spice farms and enjoy authentic Goan lunch', 1200.00, '3 hours', 'Cultural'),
(1, 'Sunset Cruise', 'Romantic cruise on Mandovi River with dinner', 2500.00, '3 hours', 'Leisure'),
(1, 'Dudhsagar Waterfalls', 'Trek to magnificent four-tiered waterfall', 2000.00, 'Full day', 'Adventure'),
-- Activities for Trip 2 (Kerala)
(2, 'Houseboat Cruise', 'Overnight stay in traditional Kerala houseboat', 8000.00, '24 hours', 'Leisure'),
(2, 'Ayurvedic Massage', 'Traditional Kerala Ayurvedic spa treatment', 2500.00, '2 hours', 'Wellness'),
(2, 'Kathakali Dance Show', 'Traditional Kerala dance performance', 800.00, '2 hours', 'Cultural'),
(2, 'Periyar Wildlife Safari', 'Boat safari to spot elephants and wildlife', 1500.00, '3 hours', 'Wildlife'),
(2, 'Tea Plantation Tour', 'Visit tea estates in Munnar hills', 1000.00, '4 hours', 'Sightseeing'),
-- Activities for Trip 3 (Jaipur)
(3, 'Amber Fort Visit', 'Explore magnificent hilltop fort with elephant ride', 1500.00, '4 hours', 'Heritage'),
(3, 'City Palace Tour', 'Visit royal palace and museum', 800.00, '2 hours', 'Heritage'),
(3, 'Jantar Mantar', 'UNESCO World Heritage astronomical observatory', 500.00, '1 hour', 'Heritage'),
(3, 'Chokhi Dhani', 'Traditional Rajasthani village experience with dinner', 1800.00, '4 hours', 'Cultural'),
(3, 'Shopping at Johari Bazaar', 'Explore traditional jewelry and handicraft markets', 500.00, '3 hours', 'Shopping');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Tables created: 6
-- Sample users: 3 (password: password123)
-- Destinations: 15
-- Trips: 3
-- Budget allocations: 3
-- Hotels: 9
-- Activities: 15
-- ============================================
