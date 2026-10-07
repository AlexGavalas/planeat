/* eslint-disable sort-keys */
import {
    bigint,
    boolean,
    date,
    doublePrecision,
    index,
    pgTable,
    primaryKey,
    text,
    time,
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

export const userCredentials = pgTable('user_credentials', {
    password_hash: text('password_hash').notNull(),
    user_id: bigint('user_id', { mode: 'number' })
        .primaryKey()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const meals = pgTable(
    'meals',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        meal: text('meal').notNull(),
        section_key: text('section_key').notNull(),
        day: date('day').notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        note: text('note'),
        rating: doublePrecision('rating'),
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

export const measurements = pgTable(
    'measurements',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        date: date('date').notNull(),
        weight: doublePrecision('weight').notNull(),
        fat_percentage: doublePrecision('fat_percentage'),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        index('measurements_user_id_date_idx').on(table.user_id, table.date),
    ],
);

export const activities = pgTable(
    'activities',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        date: date('date').notNull(),
        activity: text('activity').notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        index('activities_user_id_date_idx').on(table.user_id, table.date),
    ],
);

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

export const connections = pgTable(
    'connections',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        connection_user_id: bigint('connection_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('connections_user_id_idx').on(table.user_id)],
);

export const notifications = pgTable(
    'notifications',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        date: date('date').notNull(),
        notification_type: text('notification_type').notNull(),
        request_user_id: bigint('request_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        target_user_id: bigint('target_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        index('notifications_target_user_id_notification_type_idx').on(
            table.target_user_id,
            table.notification_type,
        ),
    ],
);

export const pushSubscriptions = pgTable(
    'push_subscriptions',
    {
        auth: text('auth').notNull(),
        created_at: timestamp('created_at', {
            mode: 'string',
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        endpoint: text('endpoint').notNull().unique(),
        id: uuid('id').defaultRandom().primaryKey(),
        p256dh: text('p256dh').notNull(),
        updated_at: timestamp('updated_at', {
            mode: 'string',
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('push_subscriptions_user_id_idx').on(table.user_id)],
);

export const notificationPreferences = pgTable('notification_preferences', {
    meal_reminder_enabled: boolean('meal_reminder_enabled')
        .notNull()
        .default(false),
    meal_reminder_time: time('meal_reminder_time')
        .notNull()
        .default('20:00:00'),
    next_notification_at: timestamp('next_notification_at', {
        mode: 'string',
        withTimezone: true,
    }),
    timezone: text('timezone').notNull(),
    user_id: bigint('user_id', { mode: 'number' })
        .primaryKey()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const mealReminderDeliveries = pgTable(
    'meal_reminder_deliveries',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        local_date: date('local_date').notNull(),
        sent_at: timestamp('sent_at', { mode: 'string', withTimezone: true })
            .defaultNow()
            .notNull(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [
        unique('meal_reminder_deliveries_user_id_local_date_unique').on(
            table.user_id,
            table.local_date,
        ),
    ],
);
