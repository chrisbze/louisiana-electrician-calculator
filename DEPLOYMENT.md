# 🚀 Production Deployment Guide

Complete step-by-step guide to deploy the Service Quote Calculator MVP to production.

## 📋 Prerequisites

Before deployment, ensure you have:

- [x] Node.js 18+ installed
- [x] Git installed and repository created
- [x] Railway account (for backend)
- [x] Vercel account (for frontend)
- [x] Domain name (optional but recommended)

## 🗂️ Deployment Stack

| Component | Service | Purpose |
|-----------|---------|---------|
| **Backend API** | Railway | Express.js server with automatic deployments |
| **Database** | Railway PostgreSQL | Managed PostgreSQL database |
| **Frontend** | Vercel | Next.js application with CDN |
| **Domain** | Vercel/Railway | Custom domain configuration |

## 🏁 Quick Start (5-Minute Deploy)

### 1. Prepare Repository

```bash
# Clone and setup project
git clone <your-repo-url>
cd service-quote-calculator

# Run automated setup
npm run deploy:setup
```

### 2. Deploy Backend (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway init
railway up

# Add PostgreSQL database
railway add postgresql

# Set environment variables (automatically set by Railway)
# DATABASE_URL - automatically configured
# Add manually:
railway variables set CORS_ORIGIN=https://your-app.vercel.app
railway variables set NODE_ENV=production
```

### 3. Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter your Railway backend URL
```

### 4. Configure Database

```bash
# Run migrations on production
cd backend
railway run npx prisma migrate deploy
railway run npm run seed
```

**🎉 Your app is now live!**

---

## 📖 Detailed Deployment Steps

### Backend Deployment (Railway)

#### Step 1: Setup Railway Project

1. **Login to Railway:**
   ```bash
   railway login
   ```

2. **Initialize project:**
   ```bash
   cd backend
   railway init
   ```
   - Select "Create new project"
   - Choose a project name
   - Select your repository

#### Step 2: Add PostgreSQL Database

1. **Through CLI:**
   ```bash
   railway add postgresql
   ```

2. **Through Dashboard:**
   - Go to [railway.app](https://railway.app)
   - Select your project
   - Click "New" → "Database" → "PostgreSQL"

#### Step 3: Configure Environment Variables

Railway automatically sets `DATABASE_URL`. Add these manually:

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### Step 4: Deploy

```bash
railway up
```

#### Step 5: Run Database Migrations

```bash
# Generate Prisma client
railway run npx prisma generate

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run seed
```

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend

```bash
cd frontend
```

#### Step 2: Deploy to Vercel

```bash
# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: service-quote-calculator-frontend
# - Directory: ./
# - Override settings? No
```

#### Step 3: Configure Environment Variables

1. **Through CLI:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   - Environment: Production
   - Value: `https://your-backend-app.railway.app`

2. **Through Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Select project → Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

#### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🌐 Alternative Deployment Options

### Option 1: Render.com (Full Stack)

**Backend:**
1. Connect GitHub repository
2. Select `backend` folder
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

**Frontend:**
1. Connect GitHub repository  
2. Select `frontend` folder
3. Build Command: `npm run build`
4. Publish Directory: `.next`

### Option 2: Supabase + Vercel

**Database (Supabase):**
1. Create Supabase project
2. Copy PostgreSQL connection string
3. Update `backend/.env`

**Backend (Railway/Render):**
- Same as above but use Supabase database URL

**Frontend (Vercel):**
- Same as above

---

## 🔧 Configuration Files

### Railway Configuration (`backend/railway.json`)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Vercel Configuration (`frontend/vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "$BACKEND_URL/api/$1"
    }
  ]
}
```

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://app.vercel.app` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://backend.railway.app` |

---

## 🔍 Health Checks & Monitoring

### Health Check Endpoints

**Backend Health Check:**
```
GET https://your-backend.railway.app/health
```

Expected Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

**Frontend Health Check:**
- Visit your Vercel URL
- Ensure services load correctly

### Monitoring Setup

**Railway Monitoring:**
- View logs: `railway logs`
- Monitor metrics in Railway dashboard

**Vercel Monitoring:**
- View deployment logs in Vercel dashboard
- Monitor Core Web Vitals

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check DATABASE_URL
railway variables

# Test database connection
railway run npx prisma db pull
```

#### 2. CORS Errors
```bash
# Update CORS_ORIGIN environment variable
railway variables set CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
```

#### 3. API Not Found (404)
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check backend deployment status
- Ensure routes are correctly defined

#### 4. Build Failures

**Backend:**
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check Railway build logs

**Frontend:**
- Ensure TypeScript compilation succeeds
- Verify environment variables are set
- Check Vercel build logs

### Debug Commands

```bash
# Railway debugging
railway logs --follow
railway status
railway variables

# Vercel debugging
vercel logs
vercel env ls
vercel inspect
```

---

## 🔄 CI/CD Setup

### GitHub Actions (Automated Deployment)

The repository includes a `.github/workflows/deploy.yml` file that automatically:

1. **Tests** both backend and frontend
2. **Deploys backend** to Railway on push to `main`
3. **Deploys frontend** to Vercel after backend deployment

### Required Secrets

Add these secrets in GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `RAILWAY_TOKEN` | Railway API token |
| `VERCEL_TOKEN` | Vercel API token |
| `ORG_ID` | Vercel organization ID |
| `PROJECT_ID` | Vercel project ID |

### Get Vercel Secrets

```bash
# Get organization and project IDs
vercel link
cat .vercel/project.json
```

---

## 🎯 Post-Deployment Checklist

### Immediate Tasks
- [ ] Health checks pass
- [ ] Database is accessible and seeded
- [ ] Frontend loads correctly
- [ ] API calls work end-to-end
- [ ] Quote calculation functions properly

### Security Tasks
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Security headers present

### Performance Tasks
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database queries optimized
- [ ] CDN serving static assets

### Monitoring Tasks
- [ ] Error logging configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring setup
- [ ] Backup strategy verified

---

## 🔗 Custom Domain Setup

### Vercel Domain (Frontend)

1. **Add domain in Vercel dashboard:**
   - Project → Settings → Domains
   - Add your domain

2. **Configure DNS:**
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`

### Railway Domain (Backend)

1. **Add domain in Railway dashboard:**
   - Project → Settings → Environment → Networking
   - Add custom domain

2. **Configure DNS:**
   - Add CNAME: `api` → `your-project.railway.app`

---

## 📊 Scaling Considerations

### Immediate Scaling (0-1000 users)
- Current setup handles this load
- Monitor response times

### Medium Scaling (1000-10000 users)
- Add Redis for caching
- Implement connection pooling
- Consider Railway Pro plan

### Large Scaling (10000+ users)
- Database read replicas
- Load balancing
- CDN for static assets
- Microservices architecture

---

## 💰 Cost Estimation

### Monthly Costs (Approximate)

| Service | Tier | Cost |
|---------|------|------|
| Railway (Backend + DB) | Hobby | $5-20 |
| Vercel (Frontend) | Hobby | $0-20 |
| Domain | Annual | $10-15 |
| **Total** | | **$15-55/month** |

### Free Tier Limits
- Railway: 500 hours/month, 1GB RAM
- Vercel: 100GB bandwidth, 6000 build minutes
- Perfect for MVP validation

---

## 📞 Support & Resources

### Documentation
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Community Support
- Railway Discord
- Vercel Discord
- Stack Overflow

### Professional Support
- Railway Pro Support
- Vercel Enterprise Support

---

**🎉 Congratulations! Your Service Quote Calculator MVP is now live in production!**

Visit your deployed application:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/health`