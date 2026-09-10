import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import * as schema from './schema';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const host = process.env.SQL_HOST;
    const dbUrl = process.env.DATABASE_URL;

    if (!host && !dbUrl) {
      return null;
    }

    // If host is configured as a unix socket path, verify socket exists before attempting connection
    if (host && host.startsWith('/') && !fs.existsSync(host)) {
      return null;
    }

    try {
      if (dbUrl) {
        global._postgresPool = new Pool({
          connectionString: dbUrl,
          ssl: { rejectUnauthorized: false },
          max: 10,
          connectionTimeoutMillis: 5000,
        });
      } else {
        global._postgresPool = new Pool({
          host: process.env.SQL_HOST,
          user: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DB_NAME,
          max: 10,
          connectionTimeoutMillis: 5000,
        });
      }

      global._postgresPool.on('error', (err) => {
        // Prevent unhandled errors from idle clients
      });
    } catch (err) {
      return null;
    }
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = pool ? drizzle(pool, { schema }) : null;

