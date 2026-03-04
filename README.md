# Eker AI Control Center

A futuristic SaaS dashboard for managing an autonomous AI agent system (Iron-Man/JARVIS style).

## Overview
This full-stack MERN application provides:

- JWT authentication with admin/operator roles
- Real-time agent status, task management, memory viewer, analytics, system logs
- WebSocket updates via Socket.IO
- Dark futuristic UI built with React and TailwindCSS
- Docker-ready deployment

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development without containers)
- MongoDB (local or Atlas)

### Local Development (Docker)

1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   # edit backend/.env with secrets
   ```

2. Start containers:
   ```bash
   docker-compose up --build
   ```

3. Access the frontend at `http://localhost:3000` and backend at `http://localhost:5000`.

### Manual Setup

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# fill in environment variables
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure

- `backend/` - Express API server with routes, controllers, models
- `frontend/` - React application with Tailwind styling
- `execution/` - Python scripts for deterministic tasks (logging, integrations)
- `directives/` - Standard Operating Procedures (SOPs) documentation
- `docker-compose.yml` - Docker configuration for services

## API Documentation
The backend exposes the following endpoints:

- `POST /api/auth/register` - register new user
- `POST /api/auth/login` - login
- `POST /api/auth/refresh` - refresh token
- `GET /api/auth/me` - get profile (protected)

- `GET /api/health` - health check
- `GET /api/tasks` - list tasks
- `POST /api/tasks` - create task
- `PATCH /api/tasks/:id` - update task
- `POST /api/tasks/:id/pause` - pause
- `POST /api/tasks/:id/resume` - resume

- `GET /api/memory` - list memories
- `POST /api/memory` - create memory

- `GET /api/system/status` - agent status
- `GET /api/system/health` - health metrics
- `GET /api/system/logs` - system logs

Socket.IO namespaces
- `/api/agent` for agent events
- `/api/logs` for streaming logs

## Next Steps
Start building frontend components and additional backend features such as analytics, integrations, audit logging, rate limiting, and tests.

## Deploying to Netlify

This repository includes `netlify.toml` and a SPA redirect in `frontend/public/_redirects` to make deployment on Netlify straightforward.

Quick steps:

```bash
# 1. Push your repo to GitHub
# 2. Go to https://app.netlify.com and choose "New site from Git"
# 3. Select this repository and set build command and publish directory (or let Netlify read `netlify.toml`):
#    Build command: cd frontend && npm install && npm run build
#    Publish directory: frontend/build
# 4. Add environment variables (e.g. REACT_APP_API_URL) in Site settings → Build & deploy → Environment
```

See `INSTALL_NETLIFY.md` for a beautifully formatted step-by-step guide (Bangla) and troubleshooting tips.

## Contribution
Contributions are welcome! Please follow the code style and add corresponding directives when new features are implemented.
