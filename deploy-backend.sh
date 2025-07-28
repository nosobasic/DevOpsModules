#!/bin/bash

# 🚀 DevOps Modules Backend Deployment Script
# This script helps deploy the backend to Render

echo "🚀 Starting backend deployment to Render..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please ensure the deployment configuration exists."
    exit 1
fi

echo "✅ Project structure verified"

# Build the project
echo "🔨 Building project..."
npm run build:client
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed"

# Check if we have the necessary environment variables
echo "🔧 Checking environment configuration..."

# Create a temporary .env.production for deployment
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=10000
CLIENT_URL=https://dev-ops-modules.vercel.app
REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
WEBHOOK_SECRET=auto-generated-by-render
OPENAI_API_KEY=your_openai_api_key_here
EOF

echo "✅ Environment configuration created"

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://render.com and sign in"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository: https://github.com/nosobasic/DevOpsModules"
echo "4. Configure the service:"
echo "   - Name: devops-modules-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build:client"
echo "   - Start Command: npm start"
echo "5. Set environment variables in Render dashboard:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - CLIENT_URL=https://dev-ops-modules.vercel.app"
echo "6. Deploy and note the URL (e.g., https://devops-modules-api.onrender.com)"
echo ""
echo "🔧 After deployment, update your Vercel environment variables:"
echo "   - VITE_API_URL=https://your-render-app.onrender.com"
echo "   - VITE_WS_URL=wss://your-render-app.onrender.com"
echo ""
echo "📝 Your current frontend URL: https://dev-ops-modules.vercel.app"
echo "📝 Expected backend URL: https://devops-modules-api.onrender.com" 