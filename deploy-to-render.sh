#!/bin/bash

echo "🚀 DevOps Modules - Render Deployment Script"
echo "=============================================="
echo ""

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Please commit your changes before deploying"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "📋 Prerequisites Check:"
echo "✅ GitHub repository: https://github.com/nosobasic/DevOpsModules"
echo "✅ Render account needed: https://render.com"
echo "✅ Vercel account needed: https://vercel.com"
echo ""

echo "🎯 Deployment Steps:"
echo "===================="
echo ""

echo "1️⃣  Deploy Backend to Render:"
echo "   • Go to: https://render.com"
echo "   • Click 'New +' → 'Web Service'"
echo "   • Connect GitHub repo: nosobasic/DevOpsModules"
echo "   • Configure settings:"
echo "     - Name: devops-modules-api"
echo "     - Environment: Node"
echo "     - Build Command: npm install"
echo "     - Start Command: npm run start:render"
echo ""

echo "2️⃣  Set Environment Variables in Render:"
echo "   • NODE_ENV=production"
echo "   • PORT=10000"
echo "   • CLIENT_URL=https://dev-ops-modules.vercel.app"
echo "   • REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org"
echo "   • REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk"
echo "   • WEBHOOK_SECRET=auto-generated-by-render"
echo "   • OPENAI_API_KEY=your_openai_api_key_here"
echo ""

echo "3️⃣  Update Vercel Frontend:"
echo "   • Go to: https://vercel.com"
echo "   • Navigate to dev-ops-modules project"
echo "   • Settings → Environment Variables"
echo "   • Add/Update:"
echo "     - VITE_API_URL=https://devops-modules-api.onrender.com"
echo "     - VITE_WS_URL=wss://devops-modules-api.onrender.com"
echo ""

echo "4️⃣  Test Deployment:"
echo "   • Health check: curl https://devops-modules-api.onrender.com/health"
echo "   • Agents API: curl https://devops-modules-api.onrender.com/api/agents"
echo "   • Frontend: https://dev-ops-modules.vercel.app"
echo ""

echo "🎉 Success Indicators:"
echo "   ✅ Service shows 'Live' status in Render"
echo "   ✅ Health check passes"
echo "   ✅ Frontend loads without console errors"
echo "   ✅ Agents can be started/stopped"
echo "   ✅ AI insights panel shows comprehensive reports"
echo ""

echo "📚 Full Documentation:"
echo "   • Render Deployment Guide: RENDER_DEPLOYMENT_GUIDE.md"
echo "   • Production Fix Guide: PRODUCTION_FIX.md"
echo ""

echo "🆘 Need Help?"
echo "   • Check Render build logs for errors"
echo "   • Verify all files are committed to GitHub"
echo "   • Test locally: npm run start:render"
echo ""

echo "⏱️  Estimated Time: 10-15 minutes"
echo "💰 Cost: Free tier available on Render"
echo ""

read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

echo "🚀 Ready to deploy! Follow the steps above."
echo "Good luck! 🍀" 