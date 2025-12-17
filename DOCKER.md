# Docker Deployment Guide

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.0+

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.docker .env
```

Edit `.env` and add your credentials:
```env
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_CLIENT_SECRET=your-actual-client-secret
JWT_SECRET=your-secret-key-minimum-256-bits
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080
- **Database:** localhost:5432

### 4. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

---

## 📦 What's Included

### Services

1. **PostgreSQL Database**
   - Port: 5432
   - Database: `planora_db`
   - User: `planora_user`
   - Persistent volume for data

2. **Backend (Spring Boot)**
   - Port: 8080
   - Java 21 with optimized JRE
   - Auto-connects to PostgreSQL
   - Health checks enabled

3. **Frontend (React + Nginx)**
   - Port: 80
   - Production-optimized build
   - Gzip compression
   - Static asset caching

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Required |
| `JWT_SECRET` | JWT signing key | Auto-generated |
| `JWT_EXPIRATION` | Token expiration (ms) | 86400000 (24h) |

### Database Configuration

The PostgreSQL database is automatically configured with:
- Database: `planora_db`
- User: `planora_user`
- Password: `planora_password`

To change these, edit `docker-compose.yml`.

---

## 🚀 Production Deployment

### Build for Production

```bash
# Build images
docker-compose build

# Tag images for registry
docker tag planora-backend:latest your-registry/planora-backend:latest
docker tag planora-frontend:latest your-registry/planora-frontend:latest

# Push to registry
docker push your-registry/planora-backend:latest
docker push your-registry/planora-frontend:latest
```

### Deploy to Server

1. Copy `docker-compose.yml` and `.env` to server
2. Run: `docker-compose up -d`
3. Configure reverse proxy (nginx/traefik) for HTTPS

---

## 🛠️ Development

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild Single Service

```bash
# Rebuild backend only
docker-compose up -d --build backend

# Rebuild frontend only
docker-compose up -d --build frontend
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it planora-postgres psql -U planora_user -d planora_db
```

### Execute Commands in Container

```bash
# Backend shell
docker exec -it planora-backend sh

# Frontend shell
docker exec -it planora-frontend sh
```

---

## 📊 Resource Usage

### Recommended Minimum
- CPU: 2 cores
- RAM: 2GB
- Disk: 5GB

### Optimize for Production
- Adjust `JAVA_OPTS` in backend Dockerfile
- Configure nginx worker processes
- Set PostgreSQL shared_buffers

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify database is healthy
docker-compose ps
```

### Frontend shows 502 error
```bash
# Ensure backend is running
docker-compose ps backend

# Check backend health
curl http://localhost:8080/actuator/health
```

### Database connection failed
```bash
# Restart postgres
docker-compose restart postgres

# Check postgres logs
docker-compose logs postgres
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# Frontend: "8081:80" instead of "80:80"
# Backend: "8081:8080" instead of "8080:8080"
```

---

## 🧹 Cleanup

```bash
# Remove all containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## 📝 Notes

- First startup may take 2-3 minutes to build images
- Database data persists in Docker volume `planora_postgres_data`
- Frontend is served via nginx for optimal performance
- Backend uses multi-stage build to minimize image size
- All services are connected via `planora-network`

---

## 🔐 Security Recommendations

1. **Change default database password** in production
2. **Use secrets management** for sensitive environment variables
3. **Enable HTTPS** with reverse proxy (nginx/traefik)
4. **Limit exposed ports** in production
5. **Regular security updates** for base images
6. **Use non-root users** in containers (already configured)

---

**Ready to deploy!** 🚀
