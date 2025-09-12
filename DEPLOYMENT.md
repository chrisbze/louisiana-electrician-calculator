# Deployment Guide

## Prerequisites
- Node.js 18+
- Git
- Railway CLI (for backend)
- Vercel CLI (for frontend)

## Local Development

1. **Start the development servers:**
   ```bash
   npm run dev
   ```

2. **Backend will run on:** http://localhost:3001
3. **Frontend will run on:** http://localhost:3000

## Production Deployment

### Backend Deployment (Railway)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy backend:**
   ```bash
   cd backend
   railway up
   ```

4. **Add PostgreSQL database:**
   - Go to Railway dashboard
   - Add PostgreSQL service
   - Connect it to your backend service

5. **Set environment variables:**
   - `DATABASE_URL` (automatically set by Railway PostgreSQL)
   - `CORS_ORIGIN` (your frontend URL)
   - `NODE_ENV=production`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL` (your backend URL)

### Alternative: Render.com

**Backend:**
1. Connect your GitHub repo to Render
2. Select backend folder
3. Add PostgreSQL database
4. Set environment variables

**Frontend:**
1. Connect your GitHub repo to Render
2. Select frontend folder as static site
3. Build command: `npm run build`
4. Publish directory: `.next`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="your-postgresql-url"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-url.vercel.app"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="https://your-backend-url.railway.app"
```

## Testing

Run tests locally:
```bash
npm run test
```

## Health Checks

- Backend health: `GET /health`
- Frontend: Check if the page loads correctly

## Monitoring

- Check Railway/Render logs for backend errors
- Check Vercel logs for frontend errors
- Monitor database connections and performance
