#!/bin/bash

# Production Deployment Script for Revenue Ripple DevOps Modules
# This script deploys the application to production environment

set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Load production environment variables
if [ -f "env.production" ]; then
    echo "📋 Loading production environment configuration..."
    export $(cat env.production | grep -v '^#' | xargs)
else
    echo "❌ Error: env.production file not found."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application for production..."
npm run build

# Set production environment
export NODE_ENV=production

# Start the production server
echo "🌐 Starting production server..."
echo "   - API URL: https://revenueripple.org"
echo "   - Dashboard URL: https://devops.revenueripple.org"
echo "   - Port: ${PORT:-3001}"

# Use PM2 for production process management (if available)
if command -v pm2 &> /dev/null; then
    echo "📊 Using PM2 for process management..."
    pm2 start npm --name "devops-modules" -- start
    pm2 save
    pm2 startup
else
    echo "⚠️  PM2 not found. Starting with npm..."
    npm start
fi

echo "✅ Production deployment completed!"
echo ""
echo "🔗 Access your DevOps Modules:"
echo "   Dashboard: https://devops.revenueripple.org"
echo "   API: https://revenueripple.org"
echo ""
echo "📊 Monitor logs:"
echo "   pm2 logs devops-modules"
echo ""
echo "🔄 Restart service:"
echo "   pm2 restart devops-modules" 