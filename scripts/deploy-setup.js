#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
  } catch (error) {
    log(`Error executing: ${command}`, colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', colors.blue);
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    execSync('npm --version', { stdio: 'pipe' });
    log('✅ Node.js and npm are installed', colors.green);
  } catch (error) {
    log('❌ Node.js or npm not found. Please install Node.js 18+', colors.red);
    process.exit(1);
  }

  try {
    execSync('git --version', { stdio: 'pipe' });
    log('✅ Git is installed', colors.green);
  } catch (error) {
    log('❌ Git not found. Please install Git', colors.red);
    process.exit(1);
  }
}

function setupEnvironmentFiles() {
  log('📝 Setting up environment files...', colors.blue);
  
  const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
  
  if (!fs.existsSync(backendEnvPath)) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'backend', '.env.example'),
      backendEnvPath
    );
    log('✅ Created backend .env file', colors.green);
    log('⚠️  Please update DATABASE_URL in backend/.env', colors.yellow);
  }

  if (!fs.existsSync(frontendEnvPath)) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'frontend', '.env.example'),
      frontendEnvPath
    );
    log('✅ Created frontend .env.local file', colors.green);
  }
}

function initializeGitRepo() {
  log('🔧 Initializing Git repository...', colors.blue);
  
  try {
    execSync('git status', { stdio: 'pipe' });
    log('✅ Git repository already initialized', colors.green);
  } catch (error) {
    execCommand('git init');
    execCommand('git add .');
    execCommand('git commit -m "Initial commit: Service Quote Calculator MVP"');
    log('✅ Git repository initialized', colors.green);
  }
}

function installDependencies() {
  log('📦 Installing dependencies...', colors.blue);
  
  // Install root dependencies
  execCommand('npm install');
  
  // Install backend dependencies
  process.chdir(path.join(__dirname, '..', 'backend'));
  execCommand('npm install');
  
  // Install frontend dependencies
  process.chdir(path.join(__dirname, '..', 'frontend'));
  execCommand('npm install');
  
  // Return to root
  process.chdir(path.join(__dirname, '..'));
  
  log('✅ All dependencies installed', colors.green);
}

function setupDatabase() {
  log('🗄️  Setting up database...', colors.blue);
  
  process.chdir(path.join(__dirname, '..', 'backend'));
  
  try {
    execCommand('npx prisma generate');
    log('✅ Prisma client generated', colors.green);
    
    // Only run migrations if DATABASE_URL is set
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('DATABASE_URL=postgresql://')) {
        execCommand('npx prisma migrate dev --name init');
        execCommand('npm run seed');
        log('✅ Database migrations and seeding completed', colors.green);
      } else {
        log('⚠️  Please configure DATABASE_URL and run: npm run migrate && npm run seed', colors.yellow);
      }
    }
  } catch (error) {
    log('⚠️  Database setup skipped. Configure DATABASE_URL and run manually', colors.yellow);
  }
  
  process.chdir(path.join(__dirname, '..'));
}

function createDeploymentGuide() {
  const guide = `# Deployment Guide

## Prerequisites
- Node.js 18+
- Git
- Railway CLI (for backend)
- Vercel CLI (for frontend)

## Local Development

1. **Start the development servers:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Backend will run on:** http://localhost:3001
3. **Frontend will run on:** http://localhost:3000

## Production Deployment

### Backend Deployment (Railway)

1. **Install Railway CLI:**
   \`\`\`bash
   npm install -g @railway/cli
   \`\`\`

2. **Login to Railway:**
   \`\`\`bash
   railway login
   \`\`\`

3. **Deploy backend:**
   \`\`\`bash
   cd backend
   railway up
   \`\`\`

4. **Add PostgreSQL database:**
   - Go to Railway dashboard
   - Add PostgreSQL service
   - Connect it to your backend service

5. **Set environment variables:**
   - \`DATABASE_URL\` (automatically set by Railway PostgreSQL)
   - \`CORS_ORIGIN\` (your frontend URL)
   - \`NODE_ENV=production\`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Deploy frontend:**
   \`\`\`bash
   cd frontend
   vercel --prod
   \`\`\`

3. **Set environment variables:**
   - \`NEXT_PUBLIC_API_URL\` (your backend URL)

### Alternative: Render.com

**Backend:**
1. Connect your GitHub repo to Render
2. Select backend folder
3. Add PostgreSQL database
4. Set environment variables

**Frontend:**
1. Connect your GitHub repo to Render
2. Select frontend folder as static site
3. Build command: \`npm run build\`
4. Publish directory: \`.next\`

## Environment Variables

### Backend (.env)
\`\`\`
DATABASE_URL="your-postgresql-url"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-url.vercel.app"
\`\`\`

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL="https://your-backend-url.railway.app"
\`\`\`

## Testing

Run tests locally:
\`\`\`bash
npm run test
\`\`\`

## Health Checks

- Backend health: \`GET /health\`
- Frontend: Check if the page loads correctly

## Monitoring

- Check Railway/Render logs for backend errors
- Check Vercel logs for frontend errors
- Monitor database connections and performance
`;

  fs.writeFileSync(path.join(__dirname, '..', 'DEPLOYMENT.md'), guide);
  log('✅ Created DEPLOYMENT.md guide', colors.green);
}

function main() {
  log('🚀 Service Quote Calculator - Deployment Setup', colors.bright);
  log('===============================================', colors.cyan);
  
  checkPrerequisites();
  setupEnvironmentFiles();
  installDependencies();
  initializeGitRepo();
  setupDatabase();
  createDeploymentGuide();
  
  log('\n🎉 Setup completed successfully!', colors.green);
  log('\nNext steps:', colors.bright);
  log('1. Configure your database URL in backend/.env', colors.yellow);
  log('2. Run: npm run migrate && npm run seed (in backend folder)', colors.yellow);
  log('3. Test locally: npm run dev', colors.yellow);
  log('4. Deploy to production using DEPLOYMENT.md guide', colors.yellow);
  log('\nHappy coding! 🎯', colors.magenta);
}

if (require.main === module) {
  main();
}

module.exports = { main };