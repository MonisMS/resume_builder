import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql', // Changed from 'driver: pg'
  dbCredentials: {
    url: process.env.DATABASE_URI!, // Changed from 'connectionString'
  },
} satisfies Config;