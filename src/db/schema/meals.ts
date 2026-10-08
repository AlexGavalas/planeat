import {
    bigint,
    date,
    doublePrecision,
    index,
    pgTable,
    primaryKey,
    text,
    time,
    unique,
    uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const meals = pgTable(
    'meals',
    {
        day: date('day').notNull(),
        id: uuid('id').defaultRandom().primaryKey(),
        meal: text('meal').notNull(),
        note: text('note'),
        rating: doublePrecision('rating'),
        section_key: text('section_key').notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('meals_user_id_day_idx').on(table.user_id, table.day)],
);

export const mealZoneTimes = pgTable(
    'meal_zone_times',
    {
        effective_from: date('effective_from').notNull(),
        time: time('time').notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        zone_key: text('zone_key').notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.user_id, table.effective_from, table.zone_key],
            name: 'meal_zone_times_user_effective_zone_pk',
        }),
        index('meal_zone_times_user_effective_idx').on(
            table.user_id,
            table.effective_from,
        ),
    ],
);

export const mealPool = pgTable(
    'meals_pool',
    {
        content: text('content').notNull(),
        id: bigint('id', { mode: 'number' })
            .primaryKey()
            .generatedByDefaultAsIdentity(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        unique('meals_pool_user_id_content_unique').on(
            table.user_id,
            table.content,
        ),
    ],
);
