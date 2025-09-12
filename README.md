# Service Quote Calculator MVP

A full-stack web application for calculating service quotes with automatic discounts, built with Next.js and Express.js.

## 🚀 Features

- **Service Selection**: Choose from various professional services
- **Automatic Discounts**: 10% off for 2 services, 15% off for 3+ services  
- **Real-time Calculation**: Instant quote generation with pricing breakdown
- **Customer Information**: Optional contact details for quote saving
- **Responsive Design**: Works on desktop and mobile devices
- **Production Ready**: Optimized for deployment with security headers

## 🏗️ Architecture

### Backend (Express.js + Prisma + PostgreSQL)
- RESTful API with comprehensive error handling
- PostgreSQL database with Prisma ORM
- Input validation and sanitization
- Rate limiting and security middleware
- Health check endpoints

### Frontend (Next.js + React + Tailwind CSS)
- Server-side rendering with Next.js 14
- Responsive UI with Tailwind CSS
- TypeScript for type safety
- Component-based architecture
- API integration with error handling

## 📦 Project Structure

```
service-quote-calculator/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── server.js       # Express server
│   │   └── seed.js         # Database seeding
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── Dockerfile          # Backend containerization
│   └── railway.json        # Railway deployment config
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── lib/            # API client and utilities
│   │   └── types/          # TypeScript definitions
│   ├── vercel.json         # Vercel deployment config
│   └── next.config.js      # Next.js configuration
├── .github/workflows/      # CI/CD pipelines
├── scripts/                # Deployment scripts
└── README.md
```

## 🛠️ Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd service-quote-calculator
   npm run deploy:setup
   ```

2. **Configure database:**
   - Update `backend/.env` with your PostgreSQL URL
   - Run migrations: `cd backend && npm run migrate && npm run seed`

3. **Start development:**
   ```bash
   npm run dev
   ```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Setup environment files:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

3. **Setup database:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   cd ..
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Production Deployment (Recommended Stack)

**Backend: Railway**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `cd backend && railway up`
4. Add PostgreSQL database through Railway dashboard
5. Set environment variables in Railway

**Frontend: Vercel**
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `cd frontend && vercel --prod`
3. Set `NEXT_PUBLIC_API_URL` environment variable

### Alternative Deployment Options

**Render.com** (Full-stack)
- Backend: Web service + PostgreSQL
- Frontend: Static site

**Supabase** (Database)
- Managed PostgreSQL with dashboard
- Built-in authentication (future enhancement)

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-url.vercel.app"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL="https://your-backend-url.railway.app"
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Backend tests only
cd backend && npm test

# Frontend tests only  
cd frontend && npm test
```

## 📡 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Quotes
- `POST /api/quotes/calculate` - Calculate quote
- `GET /api/quotes` - Get all quotes (admin)
- `GET /api/quotes/:id` - Get quote by ID

### Health
- `GET /health` - Health check

## 🔒 Security Features

- **Input Validation**: Express-validator for API inputs
- **Rate Limiting**: Protection against abuse
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Restricted cross-origin requests
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Non-root Docker Container**: Security best practices

## 🚀 Performance Optimizations

- **Compression**: Response compression middleware
- **Caching**: Next.js static generation and caching
- **Bundle Optimization**: Code splitting and tree shaking
- **Database Indexing**: Optimized queries with Prisma
- **CDN**: Static assets served via Vercel's CDN

## 📊 Monitoring

- **Health Checks**: `/health` endpoint for monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **Database Monitoring**: Connection pool and query performance

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:
- **Testing**: Automated tests for both frontend and backend
- **Linting**: Code quality checks
- **Security Scanning**: Dependency vulnerability checks
- **Deployment**: Automatic deployment on merge to main

## 📈 Scaling Considerations

- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session and query caching (future)
- **Load Balancing**: Horizontal scaling support
- **Monitoring**: Application performance monitoring (APM)

## 🛡️ Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Domain configured with proper DNS
- [ ] Security headers validated
- [ ] Performance testing completed

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📞 Support

For deployment assistance or issues:
1. Check the logs in Railway/Vercel dashboards
2. Review the DEPLOYMENT.md guide
3. Test health endpoints: `GET /health`

---

**Built with ❤️ for immediate production deployment**