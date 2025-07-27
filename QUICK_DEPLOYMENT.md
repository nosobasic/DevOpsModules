# 🚀 Quick Deployment Guide

## Your DevOps Modules are Ready for Deployment!

### 📋 What's Been Set Up

✅ **Frontend Configuration** (`vercel.json`)
- Vite build configuration
- SPA routing support
- Environment variable setup

✅ **Backend Configuration** (`render.yaml`)
- Node.js service configuration
- Environment variables
- Build and start commands

✅ **Environment Management** (`src/lib/config.ts`)
- Production URL support
- Dynamic API configuration
- WebSocket URL management

✅ **Build System** (`package.json`)
- Production build scripts
- Runtime transpilation with `tsx`
- Optimized for deployment

✅ **Security** (`.gitignore`)
- Environment files excluded
- Sensitive data protected
- Build artifacts ignored

### 🎯 Quick Deployment Steps

#### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Deploy Backend (Render)
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repo
4. **Build Command**: `npm install && npm run build:server`
5. **Start Command**: `npm start`
6. Add environment variables (see below)

#### 3. Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Create new **Project**
3. Import your GitHub repo
4. **Framework**: Vite
5. Add environment variables (see below)

### 🔧 Environment Variables

#### Frontend (Vercel)
```bash
VITE_API_URL=https://your-render-app.onrender.com
VITE_WS_URL=wss://your-render-app.onrender.com
```

#### Backend (Render)
```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=your-revenue-ripple-url
REACT_APP_REVENUE_RIPPLE_API_KEY=your-api-key
WEBHOOK_SECRET=auto-generated
OPENAI_API_KEY=your-openai-key
```

### 🔄 Update URLs
After getting your Vercel URL, update `CLIENT_URL` in Render and redeploy.

### 📊 Expected URLs
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.onrender.com`

### 🧪 Test Your Deployment
```bash
# Test backend
curl https://your-app-name.onrender.com/api/agents

# Test frontend
open https://your-app-name.vercel.app
```

### 📖 Full Documentation
See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

---

**Your DevOps Modules will be live in ~10 minutes!** 🎉 