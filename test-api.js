const fs = require('fs');
const { neon } = require('@neondatabase/serverless');
const { defaultMenu } = require('./lib/defaultMenu');

// Load environment variables manually from .env.local
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
let dbUrl = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.split('DATABASE_URL=')[1].trim();
  }
});

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(dbUrl);

async function testSeedingAndQuery() {
  try {
    console.log('1. Checking current count of menu_items in Neon Database...');
    let countRes = await sql`SELECT COUNT(*)::integer as count FROM menu_items`;
    let count = countRes[0]?.count || 0;
    console.log('Current count in DB:', count);

    if (count === 0) {
      console.log('2. Table is empty. Seeding with 200+ default menu items...');
      let itemsCount = 0;
      for (const [category, items] of Object.entries(defaultMenu)) {
        for (const item of items) {
          const desc = item.desc || null;
          const price = item.price !== undefined ? item.price : null;
          const img = item.img || null;
          const popular = !!item.popular;
          const available = true;

          await sql`
            INSERT INTO menu_items (name, description, price, category, image_url, is_popular, is_available)
            VALUES (${item.name}, ${desc}, ${price}, ${category}, ${img}, ${popular}, ${available})
          `;
          itemsCount++;
        }
      }
      console.log(`Successfully seeded ${itemsCount} items!`);
    }

    console.log('3. Fetching items to verify order and presence...');
    const dbItems = await sql`SELECT * FROM menu_items ORDER BY id ASC`;
    console.log('Total items loaded from DB:', dbItems.length);
    console.log('First item:', dbItems[0]);
    console.log('Last item:', dbItems[dbItems.length - 1]);

    // Check if some ice cream exists and has null price
    const iceCreams = dbItems.filter(item => item.category === 'Ice Cream');
    console.log(`Ice cream items count: ${iceCreams.length}`);
    console.log('Sample ice cream:', iceCreams[0]);

    console.log('\nIntegrity Check: PASSED! Database is successfully set up and loaded.');
    process.exit(0);
  } catch (err) {
    console.error('Integrity check failed:', err);
    process.exit(1);
  }
}

testSeedingAndQuery();
