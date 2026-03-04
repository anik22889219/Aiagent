# Frontend - Eker AI Control Center

## Setup

1. Install packages:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment variable in `.env`:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```
3. Start development server:
   ```bash
   npm start
   ```

## Project Structure
- `src/` contains React code
- `src/components` reusable shared components (NavBar, forms, charts)
- `src/pages` route pages (Login, Dashboard, Tasks, Memory, Analytics, Logs, Integrations, Settings)
- `src/hooks` custom hooks (useAuth, useSocket)
- `src/utils/api.js` axios wrapper with auth interceptor
- `tailwind.config.js` custom dark theme

## Styling
Uses TailwindCSS with dark background and neon blue accents. Components apply glassmorphism via backgrounds and rounded corners.

## Adding New Pages
1. Create a new file under `src/pages`.
2. Add a route in `src/App.jsx` with `<PrivateRoute>` if protected.
3. Use `NavBar` for navigation links.

## State & Authentication
- Auth context stores `user` object.
- JWT stored in `localStorage` and used by axios via interceptor.
- `useAuth` hook exposes login/logout helpers.

## Real-time Data
- `useSocket` facilitates connecting to Socket.IO namespaces.
- Example usage in `Tasks.jsx` and `AgentStatus.jsx`.

## Deployment
Build production assets:
```bash
npm run build
```
The `build` folder can be served by Nginx (see `frontend/Dockerfile`).

## Notes
- Components are intentionally minimal to focus on layout and functionality.

## Testing

The frontend uses the testing framework bundled with Create React App (Jest + React Testing Library).

Sample tests (e.g. `Login.test.jsx`) verify component rendering and basic interaction.

Run tests with:
```bash
npm test
```

You can press `a` to run all tests or `q` to quit.
- Add additional UI/UX enhancements (animations, charts, etc.) as needed.
