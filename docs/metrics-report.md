# Metrics Report – GeoExplore Project

| KPI | Current | Target | Interpretation | Action Plan |
|---|---:|---:|---|---|
| API Response Time | 680ms | ≤ 500ms | Slightly slower than target due to external API calls. | Add caching and reduce repeated requests. |
| Application Availability | 97% | ≥ 99% | App is mostly available but still needs better reliability. | Add error handling and uptime monitoring. |
| Defect Rate | 3 bugs/sprint | ≤ 2 bugs/sprint | Slightly above target. | Improve testing before merging PRs. |
| Deployment Frequency | 1/week | 2–3/week | Deployment is slower than expected. | Use smaller commits and more frequent PRs. |
| Lead Time for Changes | 3 days | ≤ 2 days | Review and merging take longer than target. | Assign reviewers earlier and speed up PR review. |

## Analysis

The current metrics show that GeoExplore is functional but still needs improvement in performance, reliability, and workflow speed. The API response time is slightly above the target, which may affect user experience. The defect rate also shows that more testing is needed before merging changes.

## Suggested Improvements

- Add caching for REST Countries API responses.
- Add better error handling for failed requests.
- Use smaller pull requests for faster reviews.
- Add automated tests before deployment.
- Monitor app availability through simple uptime checks.