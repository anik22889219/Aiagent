# Backend - Eker AI Control Center

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   # edit .env with your secrets (MONGO_URI, JWT_SECRET, etc.)
   ```
3. Start server in development:
   ```bash
   npm run dev
   ```

## Environment Variables
- `PORT` (default 5000)
- `MONGO_URI` (mongodb connection string)
- `JWT_SECRET` / `JWT_REFRESH_SECRET`
- `SOCKET_IO_CORS_ORIGIN` (frontend URL)
- `NODE_ENV` (development/production)

## API Overview
Routes are mounted under `/api`.

### Auth
- `POST /api/auth/register` - register
- `POST /api/auth/login` - login
- `POST /api/auth/refresh` - refresh token
- `GET /api/auth/me` - get profile

### Tasks
- CRUD and control endpoints at `/api/tasks`

### Memory
- CRUD and search at `/api/memory`

### System
- `/api/system/status`, `/api/system/health`, `/api/system/logs`

### Analytics
- `/api/analytics/tasks-per-day`, `/error-frequency`, `/execution-times`

### Integrations
- `/api/integrations/tools` (list)
- `/api/integrations/tools/:id` (toggle)
- `/api/integrations/n8n/trigger` (webhook stub)

### WebSocket Namespaces
- `/api/agent` — agent events (task updates)
- `/api/logs` — live logs

## Notes
- Controllers are simple and rely on MongoDB/Mongoose models.
- Add new routes under `src/routes` and controllers in `src/controllers`.
- Use `app.set('agentNamespace', agentNamespace)` to access sockets in controllers.

## Testing

This project uses Jest and Supertest for backend tests. Tests are located in `tests/` and
include authentication and task endpoint coverage.

To run tests:

1. Ensure a MongoDB instance is available (you can use a separate database for testing):
   ```bash
   export MONGO_URI_TEST="mongodb://localhost:27017/eker-test"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Execute:
   ```bash
   npm test
   ```

Tests will connect to the test database and drop it after completion.
