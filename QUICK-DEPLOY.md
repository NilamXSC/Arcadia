# 🚀 Quick Deploy Guide - 5 Minutes

Deploy Arcadia Health in 5 minutes with free hosting.

---

## Option 1: Vercel + Render (Recommended)

### Step 1: Deploy Backend (2 min)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect GitHub repo
4. Done! ✅

**Your API:** `https://your-app.onrender.com`

### Step 2: Deploy Frontend (3 min)

```bash
cd client
npm install -g vercel
vercel login
vercel
```

When prompted:
- Set `VITE_API_URL` to your Render URL
- Deploy to production

**Your App:** `https://your-app.vercel.app`

---

## Option 2: Netlify + Railway

### Backend (Railway)

```bash
cd server
npm install -g @railway/cli
railway login
railway init
railway up
```

### Frontend (Netlify)

```bash
cd client
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## Option 3: One-Click Deploy

### Backend

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Frontend

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/arcadia-health)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/arcadia-health)

---

## Environment Variables

### Backend (Render Dashboard)

```
PORT=5000
JWT_SECRET=<generate-random-string>
NODE_ENV=production
```

### Frontend (Vercel/Netlify)

```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Test Deployment

```bash
# Test backend
curl https://your-backend.onrender.com/api/health

# Test frontend
# Open browser: https://your-frontend.vercel.app
# Click "Launch Demo Platform"
```

---

## Troubleshooting

**Backend not starting?**
- Check Render logs
- Verify environment variables

**Frontend can't connect?**
- Check `VITE_API_URL` is set
- Verify backend is running
- Check CORS settings

**Need help?**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide
- Check logs in hosting dashboard

---

## Cost

**Total: $0/month** (Free tiers)

- Render: 750 hours/month free
- Vercel: 100GB bandwidth free
- MongoDB: Not required (demo mode)

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test the app
4. 🎯 Add custom domain (optional)
5. 📊 Set up monitoring (optional)

---

**That's it! Your app is live! 🎉**
