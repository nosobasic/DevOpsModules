# 🚀 DevOps Modules Deployment Guide

## Overview
This guide will help you deploy your DevOps Modules application to:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Render (Node.js/Express)

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Environment Variables**: Prepare your production environment variables

## 🔧 Environment Variables

### Frontend (Vercel)
Set these in your Vercel project settings:

```bash
VITE_API_URL=https://your-render-app.onrender.com
VITE_WS_URL=wss://your-render-app.onrender.com
```

### Backend (Render)
Set these in your Render service environment variables:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=your-revenue-ripple-url
REACT_APP_REVENUE_RIPPLE_API_KEY=your-api-key
WEBHOOK_SECRET=auto-generated-by-render
OPENAI_API_KEY=your-openai-key
```

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Connect Your Repository
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### 1.2 Configure the Service
- **Name**: `devops-modules-api`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install && npm run build:server`
- **Start Command**: `npm start`

### 1.3 Set Environment Variables
In the Render dashboard, go to your service → "Environment" tab and add:

```bash
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=your-revenue-ripple-url
REACT_APP_REVENUE_RIPPLE_API_KEY=your-api-key
WEBHOOK_SECRET=auto-generated
OPENAI_API_KEY=your-openai-key
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for the build to complete (5-10 minutes)
3. Note your service URL: `https://your-app-name.onrender.com`

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Connect Your Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository

### 2.2 Configure the Project
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (or leave empty)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Set Environment Variables
In the Vercel dashboard, go to your project → "Settings" → "Environment Variables" and add:

```bash
VITE_API_URL=https://your-render-app.onrender.com
VITE_WS_URL=wss://your-render-app.onrender.com
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Note your domain: `https://your-app-name.vercel.app`

## 🔄 Step 3: Update URLs

### 3.1 Update Backend CORS
After getting your Vercel URL, update the `CLIENT_URL` in your Render environment variables:

```bash
CLIENT_URL=https://your-vercel-app.vercel.app
```

### 3.2 Redeploy Backend
1. Go to your Render service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for the deployment to complete

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Backend API
```bash
curl https://your-render-app.onrender.com/api/agents
```

### 4.2 Test Frontend
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Check that the dashboard loads
3. Test agent start/stop functionality
4. Verify real-time updates work

### 4.3 Test WebSocket Connection
Open browser console and check for WebSocket connection errors.

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- Check that the backend CORS configuration includes your Vercel domain

#### 2. Build Failures
**Problem**: Vercel or Render build fails
**Solution**:
- Check that all dependencies are in `package.json`
- Verify build commands are correct
- Check for TypeScript errors locally first

#### 3. Environment Variables Not Working
**Problem**: App can't find environment variables
**Solution**:
- Verify variable names start with `VITE_` for frontend
- Check that variables are set in the correct service
- Redeploy after changing environment variables

#### 4. WebSocket Connection Issues
**Problem**: Real-time features not working
**Solution**:
- Verify `VITE_WS_URL` is set correctly
- Check that Render supports WebSockets (it does)
- Ensure backend WebSocket server is running

### Debug Commands

#### Check Backend Status
```bash
curl https://your-render-app.onrender.com/health
```

#### Check Frontend Build
```bash
npm run build
```

#### Test API Locally
```bash
curl http://localhost:3001/api/agents
```

## 📊 Monitoring

### Render Monitoring
- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Uptime**: Check service health status

### Vercel Monitoring
- **Analytics**: View page views and performance
- **Functions**: Monitor API route performance
- **Deployments**: Track deployment history

## 🔒 Security Considerations

### Production Security
1. **HTTPS**: Both Vercel and Render provide HTTPS by default
2. **API Keys**: Store sensitive keys in environment variables
3. **CORS**: Restrict CORS to your specific domains
4. **Rate Limiting**: Consider adding rate limiting to your API
5. **Input Validation**: Validate all user inputs

### Environment Variables Security
- Never commit sensitive keys to your repository
- Use Render's auto-generated secrets where possible
- Rotate API keys regularly
- Use different keys for development and production

## 🚀 Advanced Configuration

### Custom Domains
1. **Vercel**: Add custom domain in project settings
2. **Render**: Add custom domain in service settings
3. **DNS**: Update your DNS records accordingly

### CI/CD Pipeline
Consider setting up GitHub Actions for automated testing and deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
```

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] API endpoints tested
- [ ] WebSocket connection verified
- [ ] Agent functionality tested
- [ ] Error monitoring set up
- [ ] Custom domain configured (optional)
- [ ] SSL certificates verified
- [ ] Performance monitoring enabled

Your DevOps Modules application is now live and ready for production use! 🎉 