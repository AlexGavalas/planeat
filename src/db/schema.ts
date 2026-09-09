import {
    bigint,
    boolean,
    date,
    doublePrecision,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    created_at: timestamp('created_at', { mode: 'string', withTimezone: true })
        .defaultNow()
        .notNull(),
    email: text('email').notNull().unique(),
    full_name: text('full_name').notNull(),
    has_completed_onboarding: boolean('has_completed_onboarding').default(
        false,
    ),
    height: doublePrecision('height'),
    id: bigint('id', { mode: 'number' })
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    is_discoverable: boolean('is_discoverable').notNull().default(false),
    language: text('language').notNull(),
    target_weight: doublePrecision('target_weight'),
    food_preferences_positive: text('food_preferences_positive'),
    food_preferences_negative: text('food_preferences_negative'),
});

export const meals = pgTable('meals', {
    id: uuid('id').defaultRandom().primaryKey(),
    meal: text('meal').notNull(),
    section_key: text('section_key').notNull(),
    day: timestamp('day', { mode: 'string', withTimezone: true }).notNull(),
    user_id: bigint('user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    note: text('note'),
    rating: doublePrecision('rating'),
});

export const measurements = pgTable('measurements', {
    id: uuid('id').defaultRandom().primaryKey(),
    date: date('date').notNull(),
    weight: doublePrecision('weight').notNull(),
    fat_percentage: doublePrecision('fat_percentage'),
    user_id: bigint('user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const activities = pgTable('activities', {
    id: uuid('id').defaultRandom().primaryKey(),
    date: date('date').notNull(),
    activity: text('activity').notNull(),
    user_id: bigint('user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const mealPool = pgTable(
    'meals_pool',
    {
        id: bigint('id', { mode: 'number' })
            .primaryKey()
            .generatedByDefaultAsIdentity(),
        content: text('content').notNull(),
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

export const connections = pgTable('connections', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: bigint('user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    connection_user_id: bigint('connection_user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    date: date('date').notNull(),
    notification_type: text('notification_type').notNull(),
    request_user_id: bigint('request_user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    target_user_id: bigint('target_user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});
