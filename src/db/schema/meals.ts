import {
    bigint,
    date,
    doublePrecision,
    index,
    integer,
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

export const mealItems = pgTable(
    'meal_items',
    {
        alternative_name: text('alternative_name'),
        basis_grams: doublePrecision('basis_grams').notNull().default(100),
        brand: text('brand'),
        calories: doublePrecision('calories'),
        carbohydrates: doublePrecision('carbohydrates'),
        fat: doublePrecision('fat'),
        fiber: doublePrecision('fiber'),
        id: uuid('id').defaultRandom().primaryKey(),
        meal_id: uuid('meal_id')
            .notNull()
            .references(() => meals.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        position: integer('position').notNull(),
        protein: doublePrecision('protein'),
        provider_food_id: text('provider_food_id').notNull(),
        quantity_grams: doublePrecision('quantity_grams').notNull(),
        salt: doublePrecision('salt'),
        source: text('source').notNull(),
        sugar: doublePrecision('sugar'),
    },
    (table) => [index('meal_items_meal_id_idx').on(table.meal_id)],
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

export const mealPoolItems = pgTable(
    'meal_pool_items',
    {
        alternative_name: text('alternative_name'),
        basis_grams: doublePrecision('basis_grams').notNull().default(100),
        brand: text('brand'),
        calories: doublePrecision('calories'),
        carbohydrates: doublePrecision('carbohydrates'),
        fat: doublePrecision('fat'),
        fiber: doublePrecision('fiber'),
        id: uuid('id').defaultRandom().primaryKey(),
        meal_pool_id: bigint('meal_pool_id', { mode: 'number' })
            .notNull()
            .references(() => mealPool.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        position: integer('position').notNull(),
        protein: doublePrecision('protein'),
        provider_food_id: text('provider_food_id').notNull(),
        quantity_grams: doublePrecision('quantity_grams').notNull(),
        salt: doublePrecision('salt'),
        source: text('source').notNull(),
        sugar: doublePrecision('sugar'),
    },
    (table) => [
        index('meal_pool_items_meal_pool_id_idx').on(table.meal_pool_id),
    ],
);
