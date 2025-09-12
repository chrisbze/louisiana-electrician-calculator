const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Calculate quote
router.post('/calculate', [
  body('services').isArray({ min: 1 }),
  body('services.*.serviceId').isInt({ min: 1 }),
  body('services.*.quantity').optional().isInt({ min: 1 }),
  body('customerInfo.name').optional().isLength({ min: 1 }).trim().escape(),
  body('customerInfo.email').optional().isEmail().normalizeEmail(),
  body('customerInfo.phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { services, customerInfo } = req.body;
    
    // Fetch service details
    const serviceIds = services.map(s => s.serviceId);
    const serviceDetails = await prisma.service.findMany({
      where: { id: { in: serviceIds } }
    });

    if (serviceDetails.length !== serviceIds.length) {
      return res.status(400).json({ error: 'Some services not found' });
    }

    // Calculate quote
    let totalPrice = 0;
    let totalDuration = 0;
    const quotedServices = services.map(requestedService => {
      const service = serviceDetails.find(s => s.id === requestedService.serviceId);
      const quantity = requestedService.quantity || 1;
      const lineTotal = service.basePrice * quantity;
      
      totalPrice += lineTotal;
      totalDuration += service.duration * quantity;

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        category: service.category,
        basePrice: service.basePrice,
        quantity,
        lineTotal,
        duration: service.duration
      };
    });

    // Apply discounts for multiple services
    let discount = 0;
    if (quotedServices.length >= 3) {
      discount = totalPrice * 0.15; // 15% discount for 3+ services
    } else if (quotedServices.length === 2) {
      discount = totalPrice * 0.10; // 10% discount for 2 services
    }

    const finalPrice = totalPrice - discount;

    const quote = {
      id: Date.now(), // Simple ID for demo
      services: quotedServices,
      pricing: {
        subtotal: totalPrice,
        discount: discount,
        total: finalPrice
      },
      estimatedDuration: totalDuration,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      customerInfo: customerInfo || null,
      createdAt: new Date().toISOString()
    };

    // Save quote if customer info provided
    if (customerInfo && customerInfo.email) {
      try {
        await prisma.quote.create({
          data: {
            customerName: customerInfo.name || 'Anonymous',
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone || null,
            services: JSON.stringify(quotedServices),
            subtotal: totalPrice,
            discount: discount,
            total: finalPrice,
            estimatedDuration: totalDuration
          }
        });
      } catch (error) {
        console.error('Error saving quote:', error);
        // Continue without saving - don't fail the quote calculation
      }
    }

    res.json(quote);
  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({ error: 'Failed to calculate quote' });
  }
});

// Get all quotes (admin functionality)
router.get('/', async (req, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 quotes
    });

    const quotesWithServices = quotes.map(quote => ({
      ...quote,
      services: JSON.parse(quote.services)
    }));

    res.json(quotesWithServices);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get quote by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await prisma.quote.findUnique({
      where: { id: parseInt(id) }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const quoteWithServices = {
      ...quote,
      services: JSON.parse(quote.services)
    };

    res.json(quoteWithServices);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

module.exports = router;