import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import * as schema from './schema';

declare global {
    var habitThreadSql: Sql | undefined;
}

export const getDb = (): PostgresJsDatabase<typeof schema> => {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('Missing DATABASE_URL environment variable');
    }

    const sql =
        globalThis.habitThreadSql ??
        postgres(databaseUrl, {
            max: 5,
            prepare: false,
        });

    globalThis.habitThreadSql = sql;

    return drizzle(sql, { schema });
};
