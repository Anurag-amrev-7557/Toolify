# Deployment Guide

## Environment Variables

### Local Development
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Production (Vercel)
Set in Vercel Dashboard or CLI:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Deploy to Vercel

### Option 1: Vercel CLI

**Frontend:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

**Backend:**
```bash
cd backend
vercel --prod
```

After backend deployment, update `NEXT_PUBLIC_API_URL` in Vercel dashboard with your backend URL.

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Deploy frontend (auto-detected as Next.js)
4. Deploy backend separately (select `/backend` folder)
5. Add environment variable in Settings:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your backend URL

## Files Created

- `.env.local` - Local environment variables
- `.env.example` - Example environment file
- `app/lib/config.ts` - Centralized API URL config
- `vercel.json` - Frontend deployment config
- `backend/vercel.json` - Backend deployment config
- `.vercelignore` - Files to exclude from deployment

## Testing

After deployment:
1. Visit your frontend URL
2. Test a tool (e.g., PDF Merger)
3. Verify API calls go to production backend
