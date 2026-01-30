# Backend Deployment Checklist

## Before Deploying

- [ ] Push latest code to GitHub (`git push`)
- [ ] Test backend locally with `python -m uvicorn app.main:app --reload`
- [ ] Verify all requirements in `backend/requirements.txt`
- [ ] Check `.env` file has all required variables

## Railway Deployment Steps

### 1. Create Railway Account
- [ ] Visit https://railway.app
- [ ] Sign up with GitHub
- [ ] Authorize Railway access

### 2. Deploy Backend
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose `campusHireAPI` repository
- [ ] Railway auto-detects Python
- [ ] Wait for build to complete

### 3. Add Database
- [ ] Click "New" → "Database" → "PostgreSQL"
- [ ] Railway auto-adds `DATABASE_URL`
- [ ] Database is ready ✅

### 4. Set Environment Variables
- [ ] Go to project **Variables** tab
- [ ] Add all required variables:
  - [ ] `DATABASE_URL` (auto from PostgreSQL)
  - [ ] `SECRET_KEY` (generate random string)
  - [ ] `ALGORITHM=HS256`
  - [ ] `ACCESS_TOKEN_EXPIRE_MINUTES=30`
  - [ ] `SMTP_HOST=smtp.gmail.com`
  - [ ] `SMTP_PORT=587`
  - [ ] `SMTP_USER=your-email@gmail.com`
  - [ ] `SMTP_PASSWORD=your-app-password`
  - [ ] `ADMIN_PASSWORD=your-admin-password`
  - [ ] `FRONTEND_URL=https://campus-hire-api.vercel.app`
  - [ ] `OLLAMA_BASE_URL=http://localhost:11434`

### 5. Enable Public Networking
- [ ] Go to **Settings** → **Public Networking**
- [ ] Click **Generate Domain**
- [ ] Copy the public URL (e.g., `https://campushireapi-production.up.railway.app`)

### 6. Test Backend
- [ ] Visit `https://your-railway-url.up.railway.app/docs`
- [ ] Should see Swagger API documentation
- [ ] Try a test endpoint

## Update Frontend

### 7. Update Vercel Environment
- [ ] Go to Vercel project
- [ ] Project Settings → Environment Variables
- [ ] Update `VITE_API_URL`:
  ```
  VITE_API_URL=https://your-railway-url.up.railway.app
  ```
- [ ] Click **Redeploy**
- [ ] Wait for frontend to rebuild

## Final Testing

- [ ] Visit frontend URL: `https://campus-hire-api.vercel.app`
- [ ] Test login functionality
- [ ] Try creating an experience
- [ ] Check email notifications
- [ ] Verify company listings load

## Monitoring

- [ ] Check Railway logs for errors
- [ ] Monitor Vercel deployment status
- [ ] Test API endpoints regularly
- [ ] Check database connection

## Troubleshooting Resources

- Railway Logs: Project → Deployments → View Logs
- Vercel Logs: Project → Deployments → View Logs
- API Docs: `https://your-url/docs`
- Database Admin: Available in Railway dashboard

## Important Notes

⚠️ **Gmail App Password:**
- Go to https://myaccount.google.com/apppasswords
- Generate 16-character app password
- Use this, NOT your Gmail password

⚠️ **Secret Key:**
- Generate a random string: `openssl rand -hex 32`
- Or use any long random string
- Keep it secret and consistent

⚠️ **Admin Password:**
- Choose a strong password
- Remember it for accessing admin panel
- Can't be reset - keep it safe

