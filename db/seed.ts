// Load environment variables first
import * as dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../lib/db';
import sampleData from './sample-data';

async function main() {
  console.log('🌱 Starting database seeding process...\n');

  // Environment check
  console.log('🔍 Checking environment...');
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  console.log('✅ DATABASE_URL is configured');

  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful\n');

    // Validate sample data
    console.log('📋 Validating sample data...');
    if (!sampleData?.products || !Array.isArray(sampleData.products)) {
      throw new Error('Sample data is invalid or missing products array');
    }
    console.log(`✅ Found ${sampleData.products.length} products to seed\n`);

    // Check for duplicate slugs
    const slugs = sampleData.products.map(p => p.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length > 0) {
      console.warn('⚠️  Warning: Duplicate slugs found:', duplicateSlugs);
    }

    // Delete existing products
    console.log('🗑️  Removing existing products...');
    const deleteResult = await prisma.product.deleteMany();
    console.log(`✅ Deleted ${deleteResult.count} existing products\n`);

    // Create new products
    console.log('📦 Creating new products...');
    const createResult = await prisma.product.createMany({
      data: sampleData.products,
      skipDuplicates: true,
    });
    console.log(`✅ Successfully created ${createResult.count} products\n`);

    // Verify seeded data
    console.log('🔍 Verifying seeded data...');
    const totalProducts = await prisma.product.count();
    const featuredProducts = await prisma.product.count({
      where: { isFeatured: true }
    });

    console.log(`📊 Database now contains:`);
    console.log(`   • Total products: ${totalProducts}`);
    console.log(`   • Featured products: ${featuredProducts}`);

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('\n❌ Seeding failed with error:');

    if (error instanceof Error) {
      console.error('Error message:', error.message);

      // Provide specific guidance based on error type
      if (error.message.includes('connection')) {
        console.log('\n💡 Connection troubleshooting:');
        console.log('   • Check if DATABASE_URL is correct');
        console.log('   • Verify Neon database is active');
        console.log('   • Ensure internet connection is stable');
      }

      if (error.message.includes('host') && error.message.includes('DAVE')) {
        console.log('\n💡 This error suggests Prisma is not using the Neon adapter:');
        console.log('   • Run: rm -rf lib/generated && npx prisma generate');
        console.log('   • Ensure lib/db.ts is using the Neon adapter correctly');
        console.log('   • Check that DATABASE_URL is loaded properly');
      }

      if (error.message.includes('Unique constraint')) {
        console.log('\n💡 Unique constraint violation:');
        console.log('   • Check for duplicate slugs in sample data');
        console.log('   • Try running the seed script again');
      }
    }

    throw error;
  } finally {
    console.log('\n🔌 Closing database connection...');
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  }
}

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

// Run the seeding
main()
  .then(() => {
    console.log('✨ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error during seeding:');
    console.error(error);
    process.exit(1);
  });
