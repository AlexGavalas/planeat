import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import * as schema from './schema';

declare global {
    // eslint-disable-next-line no-var
    var planeatSql: Sql | undefined;
}

export const getDb = () => {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('Missing DATABASE_URL environment variable');
    }

    const sql =
        globalThis.planeatSql ??
        postgres(databaseUrl, {
            max: 1,
            prepare: false,
        });

    if (process.env.NODE_ENV !== 'production') {
        globalThis.planeatSql = sql;
    }

    return drizzle(sql, { schema });
};
