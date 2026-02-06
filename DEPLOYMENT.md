# Arcadia Health - Deployment Guide

Complete guide for deploying the Arcadia Health platform (Frontend + Backend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- MongoDB instance (optional for demo mode)
- Domain name (optional)
- Hosting account (Vercel, Netlify, Railway, Render, etc.)

---

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

**Step 1: Prepare Backend**

```bash
cd server
npm install
```

**Step 2: Create `render.yaml` in root**

Already created - see `render.yaml` in project root.

**Step 3: Deploy**

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml`
6. Click "Apply"

**Step 4: Set Environment Variables**

In Render dashboard:
- `PORT` = 5000
- `MONGODB_URI` = your MongoDB connection string (or leave empty for demo mode)
- `JWT_SECRET` = generate a secure random string
- `NODE_ENV` = production

**Your backend will be live at:** `https://your-app-name.onrender.com`

---

### Option 2: Deploy to Railway

**Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

**Step 2: Login and Deploy**

```bash
cd server
railway login
railway init
railway up
```

**Step 3: Add Environment Variables**

```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-secret-key"
railway variables set PORT=5000
```

---

### Option 3: Deploy to Heroku

**Step 1: Install Heroku CLI**

Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

**Step 2: Deploy**

```bash
cd server
heroku login
heroku create arcadia-health-api
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a arcadia-health-api
git push heroku main
```

**Step 3: Set Environment Variables**

```bash
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV=production
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

**Step 1: Prepare Frontend**

Update `client/src/lib/api.js`:

```javascript
const API = import.meta.env.VITE_API_URL || '/api';
```

**Step 2: Create `vercel.json` in client folder**

Already created - see `client/vercel.json`.

**Step 3: Deploy**

```bash
cd client
npm install -g vercel
vercel login
vercel
```

Follow prompts:
- Project name: `arcadia-health`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

**Step 4: Set Environment Variable**

```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.onrender.com
```

**Step 5: Redeploy**

```bash
vercel --prod
```

**Your frontend will be live at:** `https://arcadia-health.vercel.app`

---

### Option 2: Deploy to Netlify

**Step 1: Create `netlify.toml` in client folder**

Already created - see `client/netlify.toml`.

**Step 2: Deploy**

```bash
cd client
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Step 3: Set Environment Variable**

In Netlify dashboard:
- Go to Site settings → Environment variables
- Add `VITE_API_URL` = `https://your-backend-url.onrender.com`

---

### Option 3: Deploy to GitHub Pages (Static Only)

**Note:** This requires backend to be deployed separately.

```bash
cd client
npm run build
npm install -g gh-pages
gh-pages -d dist
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/arcadia
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Deployment Options Summary

| Platform | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Render** | Backend | ✅ Yes | Full-stack apps |
| **Vercel** | Frontend | ✅ Yes | React/Vite apps |
| **Netlify** | Frontend | ✅ Yes | Static sites |
| **Railway** | Backend | ✅ Limited | Quick deploys |
| **Heroku** | Backend | ❌ No | Enterprise |

---

## Quick Deploy (Recommended Stack)

### 1. Backend → Render
### 2. Frontend → Vercel

**Total Time:** ~10 minutes  
**Cost:** $0 (Free tier)

---

## Post-Deployment Checklist

- [ ] Backend is accessible at your API URL
- [ ] Frontend is accessible at your domain
- [ ] Environment variables are set correctly
- [ ] API calls from frontend work
- [ ] Guest mode works without MongoDB
- [ ] CORS is configured properly
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain configured (optional)

---

## Testing Deployment

### Test Backend

```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T..."
}
```

### Test Frontend

1. Visit your frontend URL
2. Click "Launch Demo Platform"
3. Verify dashboard loads
4. Check all features work

---

## Troubleshooting

### Backend Issues

**Problem:** Server not starting
- Check logs in Render/Railway dashboard
- Verify environment variables are set
- Check MongoDB connection string

**Problem:** CORS errors
- Add frontend URL to CORS whitelist in `server/index.js`

```javascript
app.use(cors({ 
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true 
}));
```

### Frontend Issues

**Problem:** API calls failing
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check browser console for errors

**Problem:** Build fails
- Run `npm install` in client folder
- Check for TypeScript errors
- Verify all dependencies are installed

---

## Custom Domain Setup

### Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render (Backend)

1. Go to Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Monitoring & Maintenance

### Backend Monitoring

- Check Render/Railway logs regularly
- Monitor API response times
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Frontend Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Check error logs

---

## Scaling Considerations

### When to Upgrade

- **Backend:** When free tier limits are reached (750 hours/month on Render)
- **Frontend:** When bandwidth exceeds 100GB/month on Vercel
- **Database:** When MongoDB Atlas free tier (512MB) is full

### Upgrade Path

1. **Render:** $7/month for always-on instance
2. **Vercel:** $20/month for Pro plan
3. **MongoDB Atlas:** $9/month for 2GB storage

---

## Security Best Practices

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS policies
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use MongoDB authentication
- [ ] Implement API key rotation

---

## Backup Strategy

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=./backup
```

### Code Backup

- Keep code in GitHub
- Tag releases: `git tag v1.0.0`
- Use GitHub Actions for CI/CD

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Vite Docs:** https://vitejs.dev/guide/

---

## Quick Commands Reference

```bash
# Backend
cd server && npm install && npm start

# Frontend
cd client && npm install && npm run build

# Deploy Backend (Render)
git push origin main  # Auto-deploys if connected

# Deploy Frontend (Vercel)
cd client && vercel --prod

# Check Backend Health
curl https://your-api.onrender.com/api/health

# View Backend Logs
render logs -f  # or check dashboard

# View Frontend Logs
vercel logs
```

---

## Need Help?

If you encounter issues:
1. Check the logs in your hosting dashboard
2. Verify environment variables
3. Test API endpoints with curl/Postman
4. Check CORS configuration
5. Review this guide again

---

**Deployment Complete! 🚀**

Your Arcadia Health platform is now live and accessible worldwide!
