# Support Plan

## 1. Issue Reporting Process

All issues must be reported via GitHub Issues using predefined templates.

Each report must include:

* Clear description of the issue
* Steps to reproduce
* Expected vs actual behavior
* Screenshots (if applicable)
* Browser/device information

---

## 2. Issue Categories

* **S1 (Critical):** System unavailable, major functionality broken
* **S2 (Major):** Core feature partially working
* **S3 (Minor):** UI/UX issues, non-critical bugs
* **S4 (Enhancement):** Feature requests

---

## 3. Response Times

| Severity | Description             | Response Time   |
| -------- | ----------------------- | --------------- |
| S1       | System down             | < 4 hours       |
| S2       | Major functionality bug | < 24 hours      |
| S3       | Minor issues            | < 48 hours      |
| S4       | Feature requests        | Reviewed weekly |

---

## 4. Escalation Path

1. Issue submitted via GitHub
2. QA Lead reviews and triages
3. If S1:

   * Immediate escalation to Scrum Master
   * Developer assigned immediately
   * Rollback initiated if necessary
4. If non-critical:

   * Added to sprint backlog

---

## 5. Common Issues

### External API Failure (REST Countries API)

* Risk: API downtime or slow response
* Mitigation:

  * Use cached responses where possible
  * Retry failed requests
  * Display fallback UI if API is unavailable

---

## 6. Maintenance Plan

* Monitor deployments via Vercel dashboard
* Weekly log and performance review
* Regular dependency updates

---

## 7. Support Responsibility

* QA Lead: Issue triage
* Developers: Bug fixes and deployments
* Scrum Master: Escalation handling

---

## 8. Status

✅ Support plan implemented and active
