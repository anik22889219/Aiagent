# Commander Brain — A2A Decision Engine

Commander Brain is a lightweight decision/classification service that analyzes user commands, classifies tasks, and returns a structured execution plan for specialized agents.

## Run locally

1. Copy environment example:

```powershell
cd services/commander-brain
cp .env.example .env
# or on Windows PowerShell:
# Copy-Item .env.example .env
```

2. Install dependencies and start:

```bash
cd services/commander-brain
npm install
npm start
```

The service listens on `PORT` (default 4002).

## API

POST /internal/route-task

Body (JSON):

```json
{
  "user_id": "anik_001",
  "command": "Optimize my Facebook campaign",
  "context": "E-commerce Korean skincare store"
}
```

Response: structured JSON decision object with `task_id`, `category`, `priority`, `agent_target`, `execution_plan`, `risk_level`, `requires_confirmation`.

## Docker

Build:

```bash
docker build -t commander-brain:latest .
```

Run:

```bash
docker run -p 4002:4002 --env-file .env commander-brain:latest
```

## Notes

- This repository contains a rule-based classifier and plan generator. For higher-quality planning, integrate an LLM SDK in `src/brain.js` and wire `OPENAI_API_KEY`.
- Safety rules are implemented as heuristics. Enforce confirmation flows and audit logging in production.
