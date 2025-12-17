# Planora - Budget-Based Trip Planning Application

![Planora](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen) ![React](https://img.shields.io/badge/React-18.2-blue) ![Java](https://img.shields.io/badge/Java-21-orange) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)

A production-ready, full-stack web application that generates personalized trip plans based on user budgets. Built with Java 21, Spring Boot 3.x, PostgreSQL, and React with Tailwind CSS.

## ✨ Features

- 🎯 **Smart Budget Allocation** - Automatically split budget across travel, accommodation, food, and activities
- 🗺️ **Destination Recommendations** - AI-powered suggestions based on budget and preferences
- 📊 **Multiple Plan Types** - Choose from Budget, Balanced, or Comfort plans
- 🏨 **Hotel Recommendations** - Curated hotel options within budget constraints
- 🎭 **Activity Suggestions** - Personalized activities matching your interests
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 📱 **Responsive Design** - Beautiful UI that works on mobile and desktop

## 🎨 Unique Design

Planora features a professional **Deep Ocean & Sunset** color palette with:
- Purple-Orange-Teal gradient combinations
- Glass morphism effects
- Smooth animations and transitions
- Dark theme optimized for extended use

## 🛠️ Tech Stack

### Backend
- **Java 21** - Latest LTS version
- **Spring Boot 3.2.0** - Modern Spring framework
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Production database
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL 14** or higher
- **Maven 3.8** or higher

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd Planora
\`\`\`

### 2. Database Setup

Create a PostgreSQL database:

\`\`\`sql
CREATE DATABASE planora_db;
\`\`\`

Update database credentials in \`backend/src/main/resources/application.yml\`:

\`\`\`yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/planora_db
    username: your_username
    password: your_password
\`\`\`

### 3. Backend Setup

\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

The backend will start on **http://localhost:8080**

### 4. Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend will start on **http://localhost:5173**

### 5. Docker Deployment (Recommended for Production)

For containerized deployment with Docker:

\`\`\`bash
# Copy environment template
cp .env.docker .env

# Edit .env with your credentials
# Then build and run
docker-compose up --build
\`\`\`

**Access:**
- Frontend: http://localhost
- Backend: http://localhost:8080

See [DOCKER.md](DOCKER.md) for detailed Docker deployment guide.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Trips

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/trips/plan` | Create trip plan | ✅ |
| GET | `/api/trips/{id}` | Get trip details | ✅ |
| GET | `/api/trips/my-trips` | Get user's trips | ✅ |

## 📝 Sample API Requests

### Register User

\`\`\`bash
curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
\`\`\`

### Create Trip Plan

\`\`\`bash
curl -X POST http://localhost:8080/api/trips/plan \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "startCity": "Mumbai",
    "startDate": "2025-01-15",
    "endDate": "2025-01-20",
    "numberOfTravelers": 2,
    "travelType": "COUPLE",
    "totalBudget": 50000,
    "planType": "BALANCED"
  }'
\`\`\`

## 🏗️ Project Structure

\`\`\`
Planora/
├── backend/
│   ├── src/main/java/com/planora/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Spring Data repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT & Security
│   │   └── exception/      # Exception handling
│   └── src/main/resources/
│       ├── application.yml  # Configuration
│       └── data.sql        # Sample data
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
\`\`\`

## 💡 Budget Allocation Strategy

### Budget Plan (40-30-15-15)
- Travel: 40%
- Accommodation: 30%
- Food: 15%
- Activities: 15%

### Balanced Plan (35-35-15-15)
- Travel: 35%
- Accommodation: 35%
- Food: 15%
- Activities: 15%

### Comfort Plan (25-45-15-15)
- Travel: 25%
- Accommodation: 45%
- Food: 15%
- Activities: 15%

## 🔒 Security Features

- **JWT Authentication** - Stateless token-based authentication
- **Password Encryption** - BCrypt password hashing
- **Role-Based Access** - USER and ADMIN roles
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Comprehensive request validation

## 🎯 Resume-Ready Description

**Planora - Budget-Based Trip Planning Application**

A full-stack, production-ready web application that generates personalized trip plans based on user budgets. Built with Java 21, Spring Boot 3.x, PostgreSQL, and React with Tailwind CSS.

**Key Technical Achievements:**
- Implemented clean layered architecture with Spring Boot (Controller → Service → Repository → Entity)
- Designed and developed intelligent budget allocation algorithm with configurable split strategies
- Built RESTful APIs with comprehensive DTO pattern and global exception handling
- Implemented JWT-based authentication with role-based access control (USER, ADMIN)
- Created responsive, mobile-first UI using React and Tailwind CSS with unique color palette
- Designed normalized PostgreSQL database schema with optimized indexes
- Integrated external APIs with abstraction layer for easy provider swapping
- Applied SOLID principles and industry best practices throughout the codebase

**Technologies:** Java 21, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, JWT, Maven, React, Tailwind CSS, REST API

## 📸 Screenshots

### Landing Page
Professional landing page with gradient backgrounds and feature showcase

### Dashboard
User dashboard with trip statistics and trip management

### Trip Planning
Comprehensive trip planning form with budget allocation

### Trip Details
Detailed trip view with budget breakdown, hotel and activity recommendations

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file: \`mvn clean package\`
2. Run: \`java -jar target/planora-backend-1.0.0.jar\`

### Frontend Deployment
1. Build for production: \`npm run build\`
2. Deploy the \`dist\` folder to your hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Built with ❤️ by a passionate developer

---

**Note:** This is a portfolio project demonstrating full-stack development skills with modern technologies and best practices.
