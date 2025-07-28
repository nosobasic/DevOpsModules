# 🔧 Render Deployment Fix Guide

## 🚨 **Common Render Deployment Issues**

### **Issue 1: Build Command Problems**
**Problem**: `npm run build:server` doesn't exist
**Solution**: Use `npm install` only (server uses runtime transpilation)

### **Issue 2: Start Command Problems**
**Problem**: `npm start` might not work in production
**Solution**: Use `npm run start:render`

### **Issue 3: Environment Variables**
**Problem**: Missing or incorrect environment variables
**Solution**: Set all required variables in Render dashboard

## 🎯 **Step-by-Step Render Deployment**

### **1. Go to Render Dashboard**
- Visit: https://render.com
- Sign in to your account

### **2. Create New Web Service**
- Click "New +" → "Web Service"
- Connect GitHub repository: `https://github.com/nosobasic/DevOpsModules`
- Select the repository

### **3. Configure Service Settings**
```
Name: devops-modules-api
Environment: Node
Region: Choose closest to you
Branch: main
Root Directory: ./ (leave empty)
```

### **4. Build & Start Commands**
```
Build Command: npm install
Start Command: npm run start:render
```

### **5. Environment Variables**
Add these in the Render dashboard:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://dev-ops-modules.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
WEBHOOK_SECRET=auto-generated-by-render
OPENAI_API_KEY=your_openai_api_key_here
```

### **6. Advanced Settings**
- **Auto-Deploy**: Enabled
- **Health Check Path**: `/health`
- **Health Check Timeout**: 180 seconds

### **7. Deploy**
- Click "Create Web Service"
- Wait for build to complete (5-10 minutes)
- Note the URL: `https://devops-modules-api.onrender.com`

## 🔍 **Troubleshooting**

### **If Build Fails:**
1. Check the build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### **If Start Fails:**
1. Check the runtime logs in Render dashboard
2. Verify environment variables are set correctly
3. Test locally with: `NODE_ENV=production npm run start:render`

### **If Health Check Fails:**
1. Verify the `/health` endpoint works locally
2. Check if the server is binding to the correct port
3. Ensure CORS is configured properly

## 📊 **Expected Results**

After successful deployment:
- ✅ Service shows "Live" status
- ✅ Health check passes
- ✅ API endpoints respond correctly
- ✅ WebSocket connections work

## 🔧 **Test Commands**

Once deployed, test these endpoints:

```bash
# Health check
curl https://devops-modules-api.onrender.com/health

# Agents API
curl https://devops-modules-api.onrender.com/api/agents

# WebSocket (test in browser)
wss://devops-modules-api.onrender.com
```

## 🚀 **Update Frontend**

After successful backend deployment:

1. **Go to Vercel Dashboard**
2. **Navigate to your project settings**
3. **Add/Update Environment Variables:**
   ```bash
   VITE_API_URL=https://devops-modules-api.onrender.com
   VITE_WS_URL=wss://devops-modules-api.onrender.com
   ```
4. **Redeploy** (Vercel will auto-redeploy)

## 📞 **Need Help?**

If deployment still fails:
1. Check Render build logs for specific errors
2. Verify all files are committed to GitHub
3. Test the build locally: `npm install && npm run start:render`
4. Check if any TypeScript compilation errors exist 