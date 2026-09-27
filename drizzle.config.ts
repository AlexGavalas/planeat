import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dbCredentials: {
        // Neon exposes an unpooled connection specifically for migrations.
        // Local PostgreSQL only needs DATABASE_URL, so keep it as the fallback.
        url:
            process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '',
    },
    dialect: 'postgresql',
    out: './drizzle',
    schema: './src/db/schema.ts',
});
