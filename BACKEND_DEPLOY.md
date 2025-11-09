# Backend Deployment Guide

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
cd backend
vercel login
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your repository
4. Set Root Directory to `backend`
5. Click "Deploy"

## After Deployment

1. Copy your backend URL (e.g., `https://toolify-backend.vercel.app`)
2. Go to your frontend project in Vercel
3. Settings → Environment Variables
4. Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.vercel.app`
5. Redeploy frontend

## Test Backend

Visit: `https://your-backend-url.vercel.app/api/health`

Should return: `{"status": "ok"}`
