import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Create the database connection
const db = drizzle(sql);

async function runMigrations() {
  try {
    console.log('Running migrations...');
    console.log('Database URL:', process.env.POSTGRES_URL ? 'Found' : 'Not found');
    await migrate(db, { migrationsFolder: './lib/db/migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 