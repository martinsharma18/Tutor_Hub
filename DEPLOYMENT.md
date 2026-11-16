# Frontend Deployment

## Vercel Frontend

The frontend is a Vite app inside the `frontend` directory. The Vercel project must use these settings for GitHub auto-deploys from `main`:

- Git repository: `martinsharma18/Tutor_Hub`
- Production branch: `main`
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production environment variable: `VITE_API_BASE_URL` should point to your future backend's HTTPS URL, including `/api`.

If auto-deploy stops after a merge, check the Vercel project settings first. The usual cause is the Git link or Root Directory being reset.

The frontend routing configuration remains in `frontend/vercel.json`.

Backend hosting and database provisioning are not configured in this repository. Once the backend is hosted, update `VITE_API_BASE_URL` in Vercel and redeploy the frontend. Features that call the API require a reachable backend.
