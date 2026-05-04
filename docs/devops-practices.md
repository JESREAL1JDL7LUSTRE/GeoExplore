# DevOps Practices

Purpose
-------
Practical guidance for automation, collaboration, monitoring, and a recommended cloud/DevOps improvement for this project.

Automation
----------
- CI pipeline: run `npm ci` (or install), `npm test`, lint, and build on every PR.
- Automated checks: unit tests, type-checking (`tsc`), and ESLint.
- Build artifacts: produce a production build (`next build`) and archive artifacts for deployment.
- Deployment: automated on merge to `main` (or via tagged releases) to the chosen hosting provider.

Collaboration
-------------
- Branch strategy: feature branches, PRs to `main` with required reviews (1–2 reviewers).
- PR checklist: tests pass, types pass, lint pass, description of changes, and screenshot or demo steps when UI changes.
- Code owners: assign for critical areas (UI, API, infra).

Monitoring & Observability
--------------------------
- Logs: centralize server logs (e.g., LogDNA, CloudWatch) and client error reporting (Sentry/Datadog).
- Metrics: expose basic app metrics (request latency, error rate) and visualization (Grafana/Datadog).
- Alerts: create alerts for high error rates or failed deployments.

Feedback Loop
-------------
- On incidents: run a short incident review, capture root cause, and convert findings into tasks.
- Regularly review monitoring dashboards and test coverage to prioritize improvements.

Cloud / DevOps Improvement (chosen)
----------------------------------
Dockerize the app to simplify local parity and staging deployments.

Example Dockerfile (Node + Next)
--------------------------------
```
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next .next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

Quick local commands
--------------------
Build image:

```
docker build -t geoexplore:local .
```

Run container:

```
docker run -p 3000:3000 geoexplore:local
```

Notes
-----
- If deploying to a platform like Vercel, Docker may be optional; containers are most useful for consistent staging or self-hosting.
- Pipeline optimization: cache node_modules and build cache; run tests in parallel where possible.
