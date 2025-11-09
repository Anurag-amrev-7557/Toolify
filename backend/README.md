# Backend (Toolify) — Deploying with Docker / Render

This document describes how to deploy the full Toolify backend (the `backend/` folder)
to a Docker-capable host such as Render, Fly.io, Railway, or any VPS.

Why Docker?
- The backend depends on several native libraries (poppler, tesseract, cairo/pango, etc.)
  and Python packages with native extensions. Deploying as a Docker container ensures
  the required system libraries are available and reproducible.

Included files
- `Dockerfile` — production-ready Dockerfile that installs system dependencies and
  Python packages from `requirements.txt`.

Environment variables
- `PORT` — (optional) port the service listens on (default 5001). Render provides `PORT`.
- `ADOBE_CLIENT_ID` / `ADOBE_CLIENT_SECRET` — (optional) credentials for Adobe PDF Services
- Any other keys (OCR, third-party APIs) used by your workflows should be provided as
  environment variables in the host provider dashboard.

Quick Deploy (Render web service)
1. Create a new Render Web Service and connect your GitHub repository.
2. Select "Docker" for the environment (Render will use the `backend/Dockerfile`).
3. Set the build and start commands to empty (the Dockerfile's CMD runs gunicorn).
4. Add required environment variables in Render's dashboard (ADOBE keys, etc.).
5. Deploy and wait for the service to come up. Once deployed, note the service URL
   and update the frontend rewrite in the root `vercel.json` to point `/api/*` to it.

Local build & run (quick test)
1. From repository root, build the Docker image:

   ```bash
   docker build -t toolify-backend ./backend
   ```

2. Run the container (map port 5001):

   ```bash
   docker run -e PORT=5001 -p 5001:5001 toolify-backend
   ```

3. Health check:

   ```bash
   curl http://localhost:5001/api/health
   ```

Notes & caveats
- This Dockerfile is tuned for Debian-based slim images. If you change the base image,
  you may need to adjust system package names.
- Some operations (heavy PDF conversions, OCR) may require more CPU/memory — choose
  appropriate instance sizes on Render/Fly/your host.
- Secrets should never be committed to the repo. Move any API keys from source to
  environment variables in your host dashboard.

Optional: sample `render.yaml`
- See `render.yaml` for an example configuration that can be used with Render's
  infrastructure-as-code deployment (optional).

CI: GitHub Actions (optional)
--------------------------------
To automate verification and trigger a Render deploy on push to `main`, you can
use the provided GitHub Actions workflow at `.github/workflows/deploy-backend-render.yml`.

Required repository secrets:
- `RENDER_API_KEY` — your Render account API key (keep this secret).
- `RENDER_SERVICE_ID` — the Render service id for your backend web service (starts with `srv-`).

What the workflow does:
- Checks out the repository
- Builds the backend Docker image (verifies `backend/Dockerfile`)
- Triggers a deploy on Render by calling the Render API. Render will build the image from your repo.

To enable automated deploys:
1. Add the two secrets above in your GitHub repository settings > Secrets.
2. Ensure your Render service is configured to build from the repo and use the `backend/Dockerfile`.
3. Push to `main` or run the workflow manually from the Actions tab.

