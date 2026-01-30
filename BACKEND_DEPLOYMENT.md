# Backend & Database Deployment Guide

## Option 1: Railway (Recommended - Easiest)

Railway handles everything automatically and provides free PostgreSQL!

### Step 1: Create Railway Account
1. Go to **[railway.app](https://railway.app)**
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Deploy Backend
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `aadkar240/campusHireAPI` repository
3. Select the `main` branch
4. Railway auto-detects Python and creates a build
5. **Wait for deployment** (2-3 minutes)

### Step 3: Add PostgreSQL Database
1. In Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway automatically creates a database and adds `DATABASE_URL` to env variables
3. The database is ready! ✅

### Step 4: Set Environment Variables

In Railway project **Variables** tab, add these:

```
DATABASE_URL=postgresql://... (auto-generated)
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
ADMIN_PASSWORD=your-admin-password
FRONTEND_URL=https://campus-hire-api.vercel.app
OLLAMA_BASE_URL=http://localhost:11434
```

**Important:** Get your deployed backend URL from Railway (looks like `https://campushireapi-production.up.railway.app`)

### Step 5: Enable Public Networking
1. In Railway, go to **Settings** → **Public Networking**
2. **Generate Domain** - Get your public URL
3. Copy this URL - you'll need it for frontend

### Step 6: Run Database Migrations
Railway will auto-create tables from SQLAlchemy models on first run.

If you need to run Alembic migrations:
```bash
# In Railway terminal
cd backend
alembic upgrade head
```

---

## Update Frontend with Backend URL

Go back to **Vercel**:
1. Project Settings → **Environment Variables**
2. Update `VITE_API_URL` to your Railway backend URL:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
3. Click **Redeploy** to apply changes

---

## Testing Connection

Once deployed, test the API:

```bash
curl https://your-railway-url.up.railway.app/docs
```

You should see the Swagger API documentation! 🎉

---

## Environment Variables Explained

| Variable | Example | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL connection |
| `SECRET_KEY` | `your-secret-key` | JWT token signing |
| `SMTP_USER` | `your-email@gmail.com` | Email sender |
| `SMTP_PASSWORD` | `app-specific-password` | Gmail app password (NOT your password) |
| `ADMIN_PASSWORD` | `admin123` | Admin login password |
| `FRONTEND_URL` | `https://campus-hire-api.vercel.app` | CORS allowed origin |

---

## Get Gmail App Password (Required for Email)

1. Go to **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
2. Select **Mail** and **Windows Computer**
3. Generate password (16 characters)
4. Copy and use as `SMTP_PASSWORD`

---

## Troubleshooting

### Build fails on Railway
- Check **Deployment** logs
- Ensure `requirements.txt` is in `backend/` folder
- Verify no syntax errors in Python files

### Database connection fails
- Check `DATABASE_URL` format
- Ensure PostgreSQL plugin is added in Railway
- Test connection string locally first

### API calls from frontend fail
- Verify `VITE_API_URL` is set in Vercel
- Check CORS settings in `backend/main.py`
- Ensure `FRONTEND_URL` is correct in Railway

### Emails not sending
- Verify Gmail App Password (not regular password)
- Enable "Less secure apps" if using regular Gmail password
- Check `SMTP_USER` and `SMTP_PASSWORD` are correct

---

## Next Steps After Deployment

1. ✅ Test API at `https://your-railway-url.up.railway.app/docs`
2. ✅ Test frontend at `https://campus-hire-api.vercel.app`
3. ✅ Try logging in and creating an experience
4. ✅ Check email functionality
5. ✅ Monitor Railway dashboard for errors

---

## Monitor Deployments

### Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history
- Restart services if needed

### Vercel Dashboard
- View build logs
- Check deployment status
- Monitor frontend performance

---

## Scale Later (Optional)

Once you're ready to handle more traffic:
- **Railway**: Upgrade to paid plan for more resources
- **Vercel**: Premium features for advanced analytics
- **Database**: Upgrade to dedicated PostgreSQL instance

