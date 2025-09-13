#!/bin/bash

# Service Quote Calculator - Frontend Deployment Script
# This script helps deploy the frontend to Vercel

echo "🚀 Service Quote Calculator - Frontend Deployment"
echo "================================================"

# Navigate to frontend directory
cd frontend

echo "1. Installing dependencies..."
npm install

echo "2. Building application..."
npm run build

echo "3. Setting up Vercel deployment..."
echo "Please ensure you have:"
echo "  ✅ Vercel CLI installed and logged in"
echo "  ✅ Backend deployed and URL available"

echo ""
echo "Required environment variables for Vercel:"
echo "  - NEXT_PUBLIC_API_URL=https://your-backend.railway.app"

echo ""
echo "4. Deploying to Vercel..."
vercel --prod --yes

echo "✅ Frontend deployment complete!"
echo "🌐 Your frontend should now be live!"