# Planora Database Setup Guide

## 📊 Database Files

- **`schema.sql`** - Complete database schema with all tables and indexes
- **`sample_data.sql`** - Sample data for testing and development

---

## 🚀 Quick Setup

### For PostgreSQL (Production/Render)

```bash
# Connect to your PostgreSQL database
psql -U your_username -d planora_db

# Run schema creation
\i database/schema.sql

# Insert sample data (optional)
\i database/sample_data.sql
```

### For H2 (Local Development)

The application automatically creates tables using JPA when running locally with H2.

Sample data is loaded from `backend/src/main/resources/data.sql`

---

## 📋 Database Schema

### Tables Overview

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `users` | User accounts and authentication | Parent to trips |
| `destinations` | Available travel destinations | Referenced by trips |
| `trips` | User trip plans | Links users and destinations |
| `budget_allocations` | Budget breakdown per trip | One-to-one with trips |
| `hotels` | Recommended hotels per trip | Many-to-one with trips |
| `activities` | Suggested activities per trip | Many-to-one with trips |

---

## 🗂️ Table Details

### users
```sql
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password (VARCHAR) - BCrypt hashed
- role (VARCHAR) - USER or ADMIN
- provider (VARCHAR) - OAuth provider (GOOGLE, etc.)
- provider_id (VARCHAR) - OAuth user ID
- image_url (VARCHAR) - Profile picture
- created_at, updated_at (TIMESTAMP)
```

### destinations
```sql
- id (BIGSERIAL PRIMARY KEY)
- name (VARCHAR)
- country (VARCHAR)
- description (TEXT)
- image_url (VARCHAR)
- average_cost_per_day (DECIMAL)
- best_season (VARCHAR)
- popular_activities (TEXT)
- created_at (TIMESTAMP)
```

### trips
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (BIGINT FK -> users)
- destination_id (BIGINT FK -> destinations)
- start_city (VARCHAR)
- start_date, end_date (DATE)
- number_of_travelers (INT)
- travel_type (VARCHAR) - SOLO, COUPLE, FAMILY, FRIENDS
- total_budget (DECIMAL)
- plan_type (VARCHAR) - BUDGET, BALANCED, COMFORT
- created_at, updated_at (TIMESTAMP)
```

### budget_allocations
```sql
- id (BIGSERIAL PRIMARY KEY)
- trip_id (BIGINT FK -> trips)
- travel_amount (DECIMAL)
- accommodation_amount (DECIMAL)
- food_amount (DECIMAL)
- activities_amount (DECIMAL)
- created_at (TIMESTAMP)
```

### hotels
```sql
- id (BIGSERIAL PRIMARY KEY)
- trip_id (BIGINT FK -> trips)
- name (VARCHAR)
- price_per_night (DECIMAL)
- rating (DECIMAL)
- amenities (TEXT)
- location (VARCHAR)
- created_at (TIMESTAMP)
```

### activities
```sql
- id (BIGSERIAL PRIMARY KEY)
- trip_id (BIGINT FK -> trips)
- name (VARCHAR)
- description (TEXT)
- estimated_cost (DECIMAL)
- duration (VARCHAR)
- category (VARCHAR)
- created_at (TIMESTAMP)
```

---

## 🔐 Sample Users

| Username | Email | Password | Role |
|----------|-------|----------|------|
| john_doe | john@example.com | password123 | USER |
| jane_smith | jane@example.com | password123 | USER |
| admin_user | admin@planora.com | password123 | ADMIN |

---

## 🌍 Sample Destinations (15 locations)

- Goa - Beaches and nightlife
- Jaipur - Pink City heritage
- Kerala - Backwaters and nature
- Manali - Himalayan adventure
- Udaipur - City of Lakes
- Rishikesh - Yoga and rafting
- Varanasi - Spiritual capital
- Andaman Islands - Tropical paradise
- Shimla - Queen of Hills
- Agra - Taj Mahal
- Ladakh - High altitude desert
- Munnar - Tea plantations
- Darjeeling - Tea gardens
- Mysore - City of Palaces
- Hampi - Ancient ruins

---

## 📊 Sample Data Includes

- **3 Users** - 2 regular users + 1 admin
- **15 Destinations** - Popular Indian tourist spots
- **3 Sample Trips** - Different travel types and budgets
- **3 Budget Allocations** - Budget, Balanced, Comfort plans
- **9 Hotels** - 3 per trip with ratings and amenities
- **15 Activities** - 5 per trip with costs and categories

---

## 🔄 Database Migrations

### For Render Deployment

1. Render automatically creates PostgreSQL database
2. Spring Boot creates tables on first run (JPA DDL auto)
3. To insert sample data:
   - Access Render PostgreSQL via connection string
   - Run `sample_data.sql` manually

### For Local Development

1. H2 database auto-creates tables
2. Sample data loads from `data.sql` automatically
3. Access H2 console: http://localhost:8080/h2-console

---

## 🛠️ Useful Queries

### Check all users
```sql
SELECT id, username, email, role FROM users;
```

### View all destinations with costs
```sql
SELECT name, country, average_cost_per_day, best_season 
FROM destinations 
ORDER BY average_cost_per_day;
```

### Get user's trips with destinations
```sql
SELECT t.id, u.username, d.name as destination, 
       t.start_date, t.end_date, t.total_budget
FROM trips t
JOIN users u ON t.user_id = u.id
LEFT JOIN destinations d ON t.destination_id = d.id
ORDER BY t.created_at DESC;
```

### Trip budget breakdown
```sql
SELECT t.id, d.name, t.total_budget,
       b.travel_amount, b.accommodation_amount, 
       b.food_amount, b.activities_amount
FROM trips t
JOIN budget_allocations b ON t.id = b.trip_id
LEFT JOIN destinations d ON t.destination_id = d.id;
```

### Hotels for a specific trip
```sql
SELECT name, price_per_night, rating, location
FROM hotels
WHERE trip_id = 1
ORDER BY price_per_night DESC;
```

### Activities by category
```sql
SELECT category, COUNT(*) as count, AVG(estimated_cost) as avg_cost
FROM activities
GROUP BY category
ORDER BY count DESC;
```

---

## 🔒 Security Notes

1. **Passwords** - All stored passwords are BCrypt hashed
2. **Foreign Keys** - Cascade deletes protect data integrity
3. **Indexes** - Added for performance on common queries
4. **Validation** - Application layer validates all inputs

---

## 📞 Support

For database issues:
- Check application logs
- Verify connection string
- Ensure PostgreSQL is running
- Check environment variables
