const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Services API', () => {
  let createdServices = [];

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.quote.deleteMany();
    await prisma.service.deleteMany();
    
    // Create test services
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

    createdServices = [service1, service2];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/services', () => {
    it('should return all services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('basePrice');
    });
  });

  describe('GET /api/services/:id', () => {
    it('should return a specific service', async () => {
      const serviceId = createdServices[0].id;

      const response = await request(app)
        .get(`/api/services/${serviceId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', serviceId);
      expect(response.body).toHaveProperty('name', 'Test Service 1');
    });

    it('should return 404 for non-existent service', async () => {
      await request(app)
        .get('/api/services/999')
        .expect(404);
    });
  });

  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      const newService = {
        name: 'New Test Service',
        description: 'New test description',
        basePrice: 300.00,
        category: 'New Test',
        duration: 180
      };

      const response = await request(app)
        .post('/api/services')
        .send(newService)
        .expect(201);

      expect(response.body).toHaveProperty('name', newService.name);
      expect(response.body).toHaveProperty('basePrice', newService.basePrice);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/services')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/services/:id', () => {
    it('should update an existing service', async () => {
      const serviceId = createdServices[0].id;

      const updateData = {
        name: 'Updated Service Name',
        basePrice: 150.00
      };

      const response = await request(app)
        .put(`/api/services/${serviceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('basePrice', updateData.basePrice);
    });
  });

  describe('DELETE /api/services/:id', () => {
    it('should delete an existing service', async () => {
      const serviceId = createdServices[0].id;

      await request(app)
        .delete(`/api/services/${serviceId}`)
        .expect(200);

      // Verify service is deleted
      const deletedService = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      expect(deletedService).toBeNull();
    });
  });
});