import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean up existing data (Optional: Be careful in production!)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const categoryRecords = [];

  for (const name of categories) {
    const cat = await prisma.category.create({ data: { name } });
    categoryRecords.push(cat);
  }

  // 3. Create Products
  for (let i = 0; i < 50; i++) {
    // Pick a random category
    const randomCategory = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];

    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 500 }), // Returns a string, which Decimal accepts
        stock: faker.number.int({ min: 0, max: 100 }),
        images: [faker.image.url(), faker.image.url()], // Fake image URLs
        categoryId: randomCategory.id
      }
    });
  }

  console.log('Seed completed: Created 5 categories and 50 products.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });