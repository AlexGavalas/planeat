import {
    bigint,
    date,
    doublePrecision,
    index,
    pgTable,
    text,
    uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const measurements = pgTable(
    'measurements',
    {
        date: date('date').notNull(),
        fat_percentage: doublePrecision('fat_percentage'),
        id: uuid('id').defaultRandom().primaryKey(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        weight: doublePrecision('weight').notNull(),
    },
    (table) => [
        index('measurements_user_id_date_idx').on(table.user_id, table.date),
    ],
);

export const activities = pgTable(
    'activities',
    {
        activity: text('activity').notNull(),
        date: date('date').notNull(),
        id: uuid('id').defaultRandom().primaryKey(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        index('activities_user_id_date_idx').on(table.user_id, table.date),
    ],
);
