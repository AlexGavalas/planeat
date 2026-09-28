import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import * as schema from './schema';

declare global {
    var planeatSql: Sql | undefined;
}

export const getDb = (): PostgresJsDatabase<typeof schema> => {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('Missing DATABASE_URL environment variable');
    }

    const sql =
        globalThis.planeatSql ??
        postgres(databaseUrl, {
            max: 5,
            prepare: false,
        });

    globalThis.planeatSql = sql;

    return drizzle(sql, { schema });
};
