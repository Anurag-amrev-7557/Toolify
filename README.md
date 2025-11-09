# Toolify Platform

All-in-one utility platform for PDF, image, text, and media tools.

## Setup

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Structure

- `/app` - Next.js frontend
- `/backend` - Flask API
- `/app/components/ToolTemplate.tsx` - Reusable tool UI

## Adding New Tools

1. Add tool config to `app/tools/[slug]/page.tsx`
2. Add processing logic to `backend/app.py`
3. Add tool to homepage grid
