# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed.

## Running with Docker Compose
1. Clone the repository.
2. Create a `.env` file in the root directory (see `.env.example`).
3. Run the application:
   ```bash
   docker-compose up --build -d
   ```
4. Access the services:
   - Client App: `http://localhost:8080`
   - Admin Dashboard: `http://localhost:8081` (or via Nginx proxy if configured)
   - API: `http://localhost:3000`

## Production Deployment
1. Ensure `NODE_ENV` is set to `production`.
2. Use a reverse proxy (Nginx) to handle SSL/TLS.
3. Configure environment variables for secure secrets (DB credentials, JWT secret).
4. Use the CI/CD pipeline to build and push images to a registry.
