import {
    bigint,
    boolean,
    date,
    index,
    pgTable,
    text,
    time,
    timestamp,
    unique,
    uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';

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
