# Architecture

Overview
--------
This repository is a Next.js app that provides a small geo-exploration UI backed by light API logic. The architecture below describes the main components and their data flow.

ASCII diagram
-------------

Frontend (Next.js)
  |
  | HTTP/HTTPS
  v
Optional API layer (Next API routes or serverless functions)
  |
  | fetch / store
  v
Data sources
  - External REST APIs (country data) — this project currently fetches REST data directly from the client using `src/lib/country-utils.ts`
  - Local utilities (`src/lib/country-utils.ts`) used to build and normalize external requests

CI/CD
  - GitHub Actions (or similar) runs tests -> builds -> deploy
  - Optional: Docker image for staging/production

Components
----------
- Frontend: Next.js pages and React components (see `app/` and `components/`) — handles UI, routing, and SSR/SSG when useful.
- API layer: optional; this repository currently does not include custom API routes — client components fetch external REST APIs directly via `src/lib/country-utils.ts`.
- Lib: shared utilities and domain logic in `lib/` and `src/lib/`.
- Tests: unit tests live in `tests/` and are run by CI.

Data flow
---------
1. User requests a page in the browser; Next.js serves the page (SSR/SSG or client-side render).
2. Client components call API endpoints or directly fetch external APIs through the API layer.
3. API layer aggregates and normalizes data using utilities in `lib/` and returns JSON to the client.
4. Client renders UI components (`CountryCard`, `Endpointsearch`, etc.).
5. CI runs tests and builds artifacts; on success the deployment step publishes the app (Vercel, Netlify, or container in a cloud provider).

Notes
-----
- Keep business logic in `lib/` to allow testing without the UI.
- The API layer should validate and sanitize external data before returning to the client.
