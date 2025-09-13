const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding electrician services database...');

  // Clear existing data
  await prisma.quote.deleteMany();
  await prisma.service.deleteMany();

  // Seed electrician services based on Louisiana market research
  const electricianServices = [
    // RESIDENTIAL SERVICES
    {
      name: 'Standard Outlet Installation',
      description: 'Install new 120V standard electrical outlet with proper wiring and grounding',
      basePrice: 280.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 60, // 1 hour
      materialCost: 15.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Easy'
    },
    {
      name: 'GFCI Outlet Installation',
      description: 'Install GFCI protected outlet for bathroom, kitchen, or outdoor use',
      basePrice: 210.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 90, // 1.5 hours
      materialCost: 35.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Standard'
    },
    {
      name: '220V Outlet Installation',
      description: 'Install 220-volt outlet for appliances like dryers, ranges, or A/C units',
      basePrice: 350.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 120, // 2 hours
      materialCost: 45.00,
      laborRate: 85.00,
      minimumCharge: 200.00,
      requiresPermit: true,
      permitCost: 75.00,
      difficultyLevel: 'Complex'
    },
    {
      name: 'Ceiling Fan Installation',
      description: 'Install ceiling fan with proper mounting and electrical connection',
      basePrice: 275.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 90, // 1.5 hours
      materialCost: 25.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Standard'
    },
    {
      name: 'Light Fixture Installation',
      description: 'Install interior or exterior light fixtures including chandeliers and sconces',
      basePrice: 195.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 60, // 1 hour
      materialCost: 15.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Easy'
    },
    {
      name: 'Panel Upgrade (100 Amp)',
      description: 'Upgrade electrical panel to 100 amp service with new breakers',
      basePrice: 1800.00,
      category: 'Residential',
      serviceType: 'Upgrade',
      duration: 480, // 8 hours
      materialCost: 600.00,
      laborRate: 85.00,
      minimumCharge: 500.00,
      requiresPermit: true,
      permitCost: 150.00,
      difficultyLevel: 'Complex'
    },
    {
      name: 'Panel Upgrade (200 Amp)',
      description: 'Upgrade electrical panel to 200 amp service for larger homes',
      basePrice: 2400.00,
      category: 'Residential',
      serviceType: 'Upgrade',
      duration: 600, // 10 hours
      materialCost: 800.00,
      laborRate: 85.00,
      minimumCharge: 500.00,
      requiresPermit: true,
      permitCost: 200.00,
      difficultyLevel: 'Complex'
    },
    {
      name: 'Whole House Surge Protector',
      description: 'Install whole house surge protection system at main panel',
      basePrice: 450.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 120, // 2 hours
      materialCost: 250.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Standard'
    },
    {
      name: 'Smoke Detector Hardwired',
      description: 'Install hardwired smoke detector with battery backup',
      basePrice: 175.00,
      category: 'Residential',
      serviceType: 'Installation',
      duration: 45, // 45 minutes
      materialCost: 35.00,
      laborRate: 75.00,
      minimumCharge: 150.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Easy'
    },
    {
      name: 'Electrical Troubleshooting',
      description: 'Diagnose and repair electrical issues, circuit problems, or outages',
      basePrice: 125.00,
      category: 'Residential',
      serviceType: 'Repair',
      duration: 60, // 1 hour diagnostic
      materialCost: 0.00,
      laborRate: 85.00,
      minimumCharge: 125.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Standard'
    },
    
    // COMMERCIAL SERVICES
    {
      name: 'Commercial Outlet Installation',
      description: 'Install commercial-grade outlets with proper grounding and safety compliance',
      basePrice: 385.00,
      category: 'Commercial',
      serviceType: 'Installation',
      duration: 90, // 1.5 hours
      materialCost: 35.00,
      laborRate: 125.00,
      minimumCharge: 250.00,
      requiresPermit: true,
      permitCost: 100.00,
      difficultyLevel: 'Standard'
    },
    {
      name: 'Commercial Panel Upgrade',
      description: '400-amp commercial panel upgrade with safety disconnect',
      basePrice: 3500.00,
      category: 'Commercial',
      serviceType: 'Upgrade',
      duration: 720, // 12 hours
      materialCost: 1200.00,
      laborRate: 125.00,
      minimumCharge: 500.00,
      requiresPermit: true,
      permitCost: 300.00,
      difficultyLevel: 'Complex'
    },
    
    // EMERGENCY SERVICES
    {
      name: 'Emergency Service Call',
      description: 'Emergency electrical repair service - after hours, weekends, holidays',
      basePrice: 295.00,
      category: 'Emergency',
      serviceType: 'Repair',
      duration: 60, // 1 hour minimum
      materialCost: 0.00,
      laborRate: 150.00,
      minimumCharge: 295.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Standard'
    },
    {
      name: 'Power Restoration',
      description: 'Emergency power restoration and electrical system diagnosis',
      basePrice: 195.00,
      category: 'Emergency',
      serviceType: 'Repair',
      duration: 90, // 1.5 hours
      materialCost: 25.00,
      laborRate: 125.00,
      minimumCharge: 195.00,
      requiresPermit: false,
      permitCost: null,
      difficultyLevel: 'Complex'
    }
  ];

  for (const service of electricianServices) {
    await prisma.service.create({
      data: service
    });
  }

  console.log(`Created ${electricianServices.length} electrician services`);

  // Create sample quotes for electrician services
  const sampleQuotes = [
    {
      customerName: 'John Boudreaux',
      customerEmail: 'john.boudreaux@email.com',
      customerPhone: '+1-504-555-0123',
      customerAddress: '1234 Magazine St, New Orleans, LA 70130',
      propertyType: 'Residential',
      services: JSON.stringify([
        {
          id: 1,
          name: 'Standard Outlet Installation',
          basePrice: 280.00,
          quantity: 2,
          lineTotal: 560.00,
          materialCost: 30.00,
          laborCost: 150.00
        },
        {
          id: 2,
          name: 'GFCI Outlet Installation',
          basePrice: 210.00,
          quantity: 1,
          lineTotal: 210.00,
          materialCost: 35.00,
          laborCost: 112.50
        }
      ]),
      subtotal: 770.00,
      materialsCost: 65.00,
      laborCost: 262.50,
      permitCost: 0.00,
      discount: 77.00, // 10% discount for multiple services
      total: 693.00,
      estimatedDuration: 210, // 3.5 hours
      emergencyService: false,
      scheduledDate: new Date('2025-09-15T09:00:00Z'),
      notes: 'Kitchen renovation - need GFCI for island and 2 standard outlets'
    },
    {
      customerName: 'Marie Thibodaux',
      customerEmail: 'marie.t@company.com',
      customerPhone: '+1-985-555-0456',
      customerAddress: '5678 St. Charles Ave, New Orleans, LA 70115',
      propertyType: 'Commercial',
      services: JSON.stringify([
        {
          id: 11,
          name: 'Commercial Outlet Installation',
          basePrice: 385.00,
          quantity: 4,
          lineTotal: 1540.00,
          materialCost: 140.00,
          laborCost: 500.00
        },
        {
          id: 8,
          name: 'Whole House Surge Protector',
          basePrice: 450.00,
          quantity: 1,
          lineTotal: 450.00,
          materialCost: 250.00,
          laborCost: 150.00
        }
      ]),
      subtotal: 1990.00,
      materialsCost: 390.00,
      laborCost: 650.00,
      permitCost: 100.00,
      discount: 298.50, // 15% discount for 3+ service units
      total: 1691.50,
      estimatedDuration: 480, // 8 hours
      emergencyService: false,
      scheduledDate: new Date('2025-09-20T08:00:00Z'),
      notes: 'Office renovation - need commercial grade outlets and surge protection'
    }
  ];

  for (const quote of sampleQuotes) {
    await prisma.quote.create({
      data: quote
    });
  }

  console.log(`Created ${sampleQuotes.length} sample electrician quotes`);
  console.log('Electrician services seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during electrician seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });