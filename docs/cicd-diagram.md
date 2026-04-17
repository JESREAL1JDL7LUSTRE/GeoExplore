# CI/CD Diagram - GeoExplore

## Pipeline Overview

This pipeline runs automatically whenever code is pushed to the `main` branch.

```mermaid
flowchart LR
    A[Push to main] --> B[Checkout code]
    B --> C[Install dependencies]
    C --> D[Run tests]
    D --> E[Build app]
    E --> F[Deploy to Vercel]
    F --> G[Smoke test homepage]
    G --> H[Smoke test content]
    H --> I[Production verified]