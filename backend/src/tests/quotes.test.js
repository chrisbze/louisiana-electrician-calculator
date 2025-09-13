const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Quotes API', () => {
  let testServices = [];

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.quote.deleteMany();
    await prisma.service.deleteMany();
    
    // Create test services one by one to ensure we get them back
    const service1 = await prisma.service.create({
      data: {
        name: 'Test Service 1',
        description: 'Test description 1',
        basePrice: 100.00,
        category: 'Test',
        duration: 60
      }
    });

    const service2 = await prisma.service.create({
      data: {
        name: 'Test Service 2',
        description: 'Test description 2',
        basePrice: 200.00,
        category: 'Test',
        duration: 120
      }
    });

    const service3 = await prisma.service.create({
      data: {
        name: 'Test Service 3',
        description: 'Test description 3',
        basePrice: 300.00,
        category: 'Test',
        duration: 180
      }
    });

    testServices = [service1, service2, service3];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/quotes/calculate', () => {
    it('should calculate quote for single service', async () => {
      const quoteRequest = {
        services: [
          { serviceId: testServices[0].id, quantity: 1 }
        ],
        customerInfo: {
          name: 'Test Customer',
          email: 'test@example.com'
        }
      };

      const response = await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(200);

      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('pricing');
      expect(response.body.pricing.subtotal).toBe(100.00);
      expect(response.body.pricing.discount).toBe(0); // No discount for 1 service
      expect(response.body.pricing.total).toBe(100.00);
    });

    it('should apply 10% discount for 2 services', async () => {
      const quoteRequest = {
        services: [
          { serviceId: testServices[0].id, quantity: 1 },
          { serviceId: testServices[1].id, quantity: 1 }
        ]
      };

      const response = await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(200);

      expect(response.body.pricing.subtotal).toBe(300.00);
      expect(response.body.pricing.discount).toBe(30.00); // 10% discount
      expect(response.body.pricing.total).toBe(270.00);
    });

    it('should apply 15% discount for 3+ services', async () => {
      const quoteRequest = {
        services: [
          { serviceId: testServices[0].id, quantity: 1 },
          { serviceId: testServices[1].id, quantity: 1 },
          { serviceId: testServices[2].id, quantity: 1 }
        ]
      };

      const response = await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(200);

      expect(response.body.pricing.subtotal).toBe(600.00);
      expect(response.body.pricing.discount).toBe(90.00); // 15% discount
      expect(response.body.pricing.total).toBe(510.00);
    });

    it('should handle quantity multipliers', async () => {
      const quoteRequest = {
        services: [
          { serviceId: testServices[0].id, quantity: 2 }
        ]
      };

      const response = await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(200);

      expect(response.body.pricing.subtotal).toBe(200.00);
      expect(response.body.estimatedDuration).toBe(120); // 2 * 60 minutes
    });

    it('should save quote when customer info provided', async () => {
      const quoteRequest = {
        services: [
          { serviceId: testServices[0].id, quantity: 1 }
        ],
        customerInfo: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '1234567890' // Remove + prefix as it might cause validation issues
        }
      };

      const response = await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(200);

      expect(response.body.customerInfo.email).toBe('test@example.com');

      // Verify quote was saved
      const savedQuotes = await prisma.quote.findMany();
      expect(savedQuotes.length).toBeGreaterThan(0);
      expect(savedQuotes[0].customerEmail).toBe('test@example.com');
    });

    it('should validate service IDs exist', async () => {
      const quoteRequest = {
        services: [
          { serviceId: 999, quantity: 1 }
        ]
      };

      await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(400);
    });

    it('should require at least one service', async () => {
      const quoteRequest = {
        services: []
      };

      await request(app)
        .post('/api/quotes/calculate')
        .send(quoteRequest)
        .expect(400);
    });
  });

  describe('GET /api/quotes', () => {
    it('should return saved quotes', async () => {
      // Create a test quote
      await prisma.quote.create({
        data: {
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          services: JSON.stringify([{ name: 'Test Service' }]),
          subtotal: 100.00,
          discount: 0,
          total: 100.00,
          estimatedDuration: 60
        }
      });

      const response = await request(app)
        .get('/api/quotes')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('customerEmail', 'test@example.com');
    });
  });

  describe('GET /api/quotes/:id', () => {
    it('should return a specific quote', async () => {
      const quote = await prisma.quote.create({
        data: {
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          services: JSON.stringify([{ name: 'Test Service' }]),
          subtotal: 100.00,
          discount: 0,
          total: 100.00,
          estimatedDuration: 60
        }
      });

      const response = await request(app)
        .get(`/api/quotes/${quote.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', quote.id);
      expect(response.body).toHaveProperty('customerEmail', 'test@example.com');
    });

    it('should return 404 for non-existent quote', async () => {
      await request(app)
        .get('/api/quotes/999')
        .expect(404);
    });
  });
});