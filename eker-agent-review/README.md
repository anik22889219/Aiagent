# Eker Agent — Review Repository

This is a minimal private review repository scaffold for the `Eker Agent` service. It is intended for quick code review, CI smoke tests, and pushing to a private GitHub repo for limited access.

## Quickstart

1. Create a private repository on GitHub (or use the provided `create_repo.sh` with `gh`):

```bash
# replace <your-org-or-user> and adjust name as needed
gh repo create <your-org-or-user>/eker-agent-review --private --source=. --push
```

2. Install and run locally:

```bash
cd eker-agent-review
npm install
npm start
# Health: http://localhost:4003/health
```

3. Use the `/internal/route-task` endpoint to POST sample tasks for review.

## Files
- `src/server.js` — minimal Express server with `/health` and `/internal/route-task`.
- `.github/workflows/ci.yml` — CI that installs dependencies and asserts `/health`.
- `create_repo.sh` — helper script to create and push a private GitHub repo using `gh`.

## Security
- Keep `.env` values out of the repository. Add secrets in GitHub repo settings for CI if required.

## Next steps
- Add unit tests and static analysis
- Wire the review repo to the main monorepo as a submodule or GitHub repo link
- Configure access control and CODEOWNERS
