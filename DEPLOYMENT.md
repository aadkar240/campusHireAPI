# Deployment Guide for CampusHire AI

## Frontend Deployment to Vercel

### Step 1: Prepare Your Frontend

Your frontend is ready for Vercel! It's a Vite + React app with the correct build configuration.

### Step 2: Push to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/campushire-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your repository
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`
6. Add Environment Variables (see Backend Setup below)
7. Deploy!

**Option B: Using Vercel CLI**
```bash
npm i -g vercel
vercel
```

---

## Backend Deployment (FastAPI)

Since Vercel is for frontend hosting, deploy your FastAPI backend separately.

### Recommended Backend Hosting Options:

#### Option 1: Railway (Recommended - Simple & Free Tier)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Create new project → Deploy from GitHub repo
4. Select your repo
5. Add environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
   - `ADMIN_PASSWORD`
   - `FRONTEND_URL`
6. Railway auto-detects Python and deploys

#### Option 2: Render (Free Tier Available)
1. Go to [render.com](https://render.com)
2. New → Web Service → Connect GitHub
3. Configure with `backend/` as root directory
4. Set environment variables
5. Deploy

#### Option 3: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repo
4. Add buildpacks: Python
5. Set Config Vars (environment variables)
6. Deploy

---

## Environment Variables Setup

### Frontend (.env file for Vercel)
```
VITE_API_URL=https://your-backend-url.com
```

Create a `.env.production` file in frontend folder with production API URL.

### Backend (.env file)
```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_PASSWORD=your-admin-password
OLLAMA_BASE_URL=http://localhost:11434
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Update Frontend API Calls

Update your API client to use environment variable for API URL:

In `src/api/client.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const client = axios.create({
  baseURL: API_URL,
});
```

Then in frontend pages/components, ensure you're using relative paths like `/api/v1/users` instead of hardcoded URLs.

---

## Database Setup

For production database, use PostgreSQL:
- **Railway**: Adds PostgreSQL automatically
- **Render**: Use Render PostgreSQL
- **Heroku**: Add Heroku Postgres add-on

---

## CORS Configuration

Update `backend/main.py` CORS settings for production:

```python
origins = [
    "https://your-frontend-url.vercel.app",
    "http://localhost:3000",  # keep for local dev
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Quick Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Set environment variables in both platforms
- [ ] Update API URL in frontend
- [ ] Update CORS origins in backend
- [ ] Test frontend → backend API calls
- [ ] Verify database migrations run on backend deploy

---

## Troubleshooting

**Frontend won't build on Vercel:**
- Check `vercel.json` paths match your structure
- Ensure `package.json` scripts are correct
- Check Node version compatibility

**Backend API calls failing:**
- Verify CORS settings include frontend URL
- Check environment variables are set
- Test API endpoint directly in browser

**Database connection failing:**
- Verify `DATABASE_URL` format
- Ensure database is created
- Check network/firewall settings

