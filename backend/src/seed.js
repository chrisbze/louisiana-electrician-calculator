const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.quote.deleteMany();
  await prisma.service.deleteMany();

  // Seed services
  const services = [
    {
      name: 'Website Design',
      description: 'Custom website design with modern UI/UX',
      basePrice: 2500.00,
      category: 'Web Development',
      duration: 1440 // 24 hours
    },
    {
      name: 'SEO Optimization',
      description: 'Complete SEO audit and optimization',
      basePrice: 800.00,
      category: 'Digital Marketing',
      duration: 480 // 8 hours
    },
    {
      name: 'Content Writing',
      description: 'Professional content writing and copywriting',
      basePrice: 300.00,
      category: 'Content',
      duration: 240 // 4 hours
    },
    {
      name: 'Social Media Management',
      description: 'Monthly social media management and strategy',
      basePrice: 1200.00,
      category: 'Digital Marketing',
      duration: 960 // 16 hours
    },
    {
      name: 'E-commerce Setup',
      description: 'Complete e-commerce store setup with payment integration',
      basePrice: 3500.00,
      category: 'Web Development',
      duration: 2880 // 48 hours
    },
    {
      name: 'Logo Design',
      description: 'Professional logo design with multiple concepts',
      basePrice: 450.00,
      category: 'Design',
      duration: 360 // 6 hours
    },
    {
      name: 'Mobile App Development',
      description: 'Native or cross-platform mobile app development',
      basePrice: 8000.00,
      category: 'Mobile Development',
      duration: 5760 // 96 hours
    },
    {
      name: 'Database Design',
      description: 'Database architecture and optimization',
      basePrice: 1500.00,
      category: 'Backend Development',
      duration: 720 // 12 hours
    },
    {
      name: 'API Development',
      description: 'RESTful API development and documentation',
      basePrice: 2000.00,
      category: 'Backend Development',
      duration: 960 // 16 hours
    },
    {
      name: 'Hosting Setup',
      description: 'Server setup and deployment configuration',
      basePrice: 400.00,
      category: 'DevOps',
      duration: 180 // 3 hours
    },
    {
      name: 'Security Audit',
      description: 'Complete security assessment and recommendations',
      basePrice: 1800.00,
      category: 'Security',
      duration: 720 // 12 hours
    },
    {
      name: 'Performance Optimization',
      description: 'Website and application performance optimization',
      basePrice: 900.00,
      category: 'Optimization',
      duration: 480 // 8 hours
    }
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service
    });
  }

  console.log(`Created ${services.length} services`);

  // Create some sample quotes
  const sampleQuotes = [
    {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      services: JSON.stringify([
        {
          id: 1,
          name: 'Website Design',
          basePrice: 2500.00,
          quantity: 1,
          lineTotal: 2500.00
        },
        {
          id: 2,
          name: 'SEO Optimization',
          basePrice: 800.00,
          quantity: 1,
          lineTotal: 800.00
        }
      ]),
      subtotal: 3300.00,
      discount: 330.00, // 10% discount for 2 services
      total: 2970.00,
      estimatedDuration: 1920
    },
    {
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1987654321',
      services: JSON.stringify([
        {
          id: 5,
          name: 'E-commerce Setup',
          basePrice: 3500.00,
          quantity: 1,
          lineTotal: 3500.00
        },
        {
          id: 6,
          name: 'Logo Design',
          basePrice: 450.00,
          quantity: 1,
          lineTotal: 450.00
        },
        {
          id: 10,
          name: 'Hosting Setup',
          basePrice: 400.00,
          quantity: 1,
          lineTotal: 400.00
        }
      ]),
      subtotal: 4350.00,
      discount: 652.50, // 15% discount for 3+ services
      total: 3697.50,
      estimatedDuration: 3420
    }
  ];

  for (const quote of sampleQuotes) {
    await prisma.quote.create({
      data: quote
    });
  }

  console.log(`Created ${sampleQuotes.length} sample quotes`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });