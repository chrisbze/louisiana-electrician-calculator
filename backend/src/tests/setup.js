const { PrismaClient } = require('@prisma/client');

// Use a separate test database and port
process.env.DATABASE_URL = "file:./test.db";
process.env.PORT = 3002;

const prisma = new PrismaClient();

beforeAll(async () => {
  // Apply migrations to test database
  const { execSync } = require('child_process');
  try {
    execSync('npx prisma migrate dev --name test-init', { 
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: "file:./test.db" }
    });
  } catch (error) {
    // Migration might already exist, that's okay
    console.log('Test database migration completed or already exists');
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});