# Deployment

## Vercel Frontend

The frontend is a Vite app inside the `frontend` directory. The Vercel project must use these settings for GitHub auto-deploys from `main`:

- Git repository: `martinsharma18/Tutor_Hub`
- Production branch: `main`
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production environment variable: `VITE_API_BASE_URL=https://tutor-hub-api.onrender.com/api`

If auto-deploy stops after a merge, check the Vercel project settings first. The usual cause is the Git link or Root Directory being reset.

## Render Backend

The backend deploys from `backend/Dockerfile` and uses PostgreSQL on Render.

- Service: `tutor-hub-api`
- Health check: `/health`
- Database: `tutor-hub-db`
