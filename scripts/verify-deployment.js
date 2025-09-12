#!/usr/bin/env node

const axios = require('axios');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

async function verifyEndpoint(url, description) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    log(`✅ ${description}: ${response.status} ${response.statusText}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description}: ${error.message}`, colors.red);
    return false;
  }
}

async function verifyDeployment() {
  log('🔍 Verifying Service Quote Calculator Deployment', colors.blue);
  log('='.repeat(50), colors.blue);
  
  const backendUrl = process.env.BACKEND_URL || process.argv[2];
  const frontendUrl = process.env.FRONTEND_URL || process.argv[3];
  
  if (!backendUrl && !frontendUrl) {
    log('Usage: node verify-deployment.js <backend-url> <frontend-url>', colors.yellow);
    log('Or set BACKEND_URL and FRONTEND_URL environment variables', colors.yellow);
    process.exit(1);
  }
  
  let allPassed = true;
  
  // Backend verification
  if (backendUrl) {
    log('\n🔧 Backend Verification:', colors.blue);
    
    // Health check
    const healthPassed = await verifyEndpoint(`${backendUrl}/health`, 'Health Check');
    allPassed = allPassed && healthPassed;
    
    // Services endpoint
    const servicesPassed = await verifyEndpoint(`${backendUrl}/api/services`, 'Services API');
    allPassed = allPassed && servicesPassed;
    
    // Test quote calculation
    try {
      const response = await axios.post(`${backendUrl}/api/quotes/calculate`, {
        services: [{ serviceId: 1, quantity: 1 }]
      }, { timeout: 10000 });
      
      if (response.status === 200 && response.data.pricing) {
        log('✅ Quote Calculation: Working correctly', colors.green);
      } else {
        log('❌ Quote Calculation: Invalid response format', colors.red);
        allPassed = false;
      }
    } catch (error) {
      log(`❌ Quote Calculation: ${error.message}`, colors.red);
      allPassed = false;
    }
  }
  
  // Frontend verification
  if (frontendUrl) {
    log('\n🌐 Frontend Verification:', colors.blue);
    
    const frontendPassed = await verifyEndpoint(frontendUrl, 'Frontend Loading');
    allPassed = allPassed && frontendPassed;
    
    // Check if it's a Next.js application
    try {
      const response = await axios.get(frontendUrl, { timeout: 10000 });
      if (response.data.includes('_next') || response.data.includes('next')) {
        log('✅ Next.js Detection: Confirmed Next.js application', colors.green);
      } else {
        log('⚠️  Next.js Detection: Could not confirm Next.js', colors.yellow);
      }
    } catch (error) {
      log('⚠️  Next.js Detection: Could not verify', colors.yellow);
    }
  }
  
  // Overall result
  log('\n' + '='.repeat(50), colors.blue);
  if (allPassed) {
    log('🎉 All deployment checks passed!', colors.green);
    log('Your Service Quote Calculator is ready for production use.', colors.green);
  } else {
    log('❌ Some deployment checks failed.', colors.red);
    log('Please review the errors above and fix any issues.', colors.red);
  }
  
  // Additional information
  log('\n📊 Deployment Status Summary:', colors.blue);
  log(`Backend URL: ${backendUrl || 'Not provided'}`, colors.yellow);
  log(`Frontend URL: ${frontendUrl || 'Not provided'}`, colors.yellow);
  log(`Health Status: ${allPassed ? 'Healthy' : 'Issues Detected'}`, allPassed ? colors.green : colors.red);
  
  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  verifyDeployment();
}