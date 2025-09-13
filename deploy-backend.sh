#!/bin/bash

# Service Quote Calculator - Backend Deployment Script
# This script helps deploy the backend to Railway

echo "🚀 Service Quote Calculator - Backend Deployment"
echo "================================================"

# Navigate to backend directory
cd backend

echo "1. Installing dependencies..."
npm install

echo "2. Generating Prisma client..."
npx prisma generate

echo "3. Building application..."
npm run build

echo "4. Setting up Railway deployment..."
echo "Please ensure you have:"
echo "  ✅ Railway CLI installed and logged in"
echo "  ✅ PostgreSQL database addon added to your Railway project"
echo "  ✅ Environment variables configured"

echo ""
echo "Required environment variables for Railway:"
echo "  - DATABASE_URL (automatically provided by Railway PostgreSQL)"
echo "  - NODE_ENV=production"
echo "  - PORT (automatically provided by Railway)"
echo "  - CORS_ORIGIN=https://your-frontend-url.vercel.app"
echo "  - FRONTEND_URL=https://your-frontend-url.vercel.app"

echo ""
echo "5. Deploying to Railway..."
railway up --detach

echo ""
echo "6. Running database migrations..."
railway run npx prisma migrate deploy

echo ""
echo "7. Seeding database..."
railway run npm run seed

echo "✅ Deployment complete!"
echo "🌐 Your backend should now be live at: https://your-project.railway.app"