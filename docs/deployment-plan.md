# Deployment Plan

## 1. Target Environment

The GeoExplore web application is deployed using:

* Platform: Vercel (Cloud Hosting)
* Frontend: Next.js (React framework)
* Backend: REST API (external services such as REST Countries API)
* Version Control: GitHub (connected to Vercel for CI/CD)

---

## 2. Rollout Strategy

**Strategy: Continuous Deployment (CI/CD)**

* All changes are pushed via pull requests
* Only approved pull requests are merged into the `main` branch
* Each merge automatically triggers a production deployment in Vercel
* Vercel builds, tests, and deploys the latest version

---

## 3. Deployment Workflow

1. Developer creates a feature branch
2. Changes are committed and pushed to GitHub
3. Pull request is created and reviewed
4. After approval, PR is merged into `main`
5. Vercel automatically builds and deploys the application
6. Deployment becomes live at the production URL

---

## 4. Rollback Steps

If a deployment introduces critical issues:

### Step-by-step rollback:

**Option 1: Instant Rollback via Vercel**

1. Open Vercel dashboard
2. Navigate to project deployments
3. Select the last stable deployment
4. Click **"Promote to Production"**

**Option 2: Git-based Fix**

1. Identify faulty commit:

   ```
   git log
   ```
2. Revert the commit:

   ```
   git revert <commit-hash>
   ```
3. Push changes:

   ```
   git push origin main
   ```
4. Vercel automatically redeploys the corrected version

---

## 5. Deployment Verification

After deployment, the following checks are performed:

* Application loads successfully
* Pages render correctly
* API requests return valid data
* No console or runtime errors
* External API (REST Countries) is reachable

---

## 6. Deployment Status

* Platform: Vercel
* Status: Successfully deployed
* Accessibility: Publicly accessible online

---

## 7. Deployment Link

👉 Insert deployed URL:
https://geo-explore-eight.vercel.app/
