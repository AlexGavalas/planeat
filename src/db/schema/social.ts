import { bigint, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const connections = pgTable(
    'connections',
    {
        connection_user_id: bigint('connection_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        id: uuid('id').defaultRandom().primaryKey(),
        user_id: bigint('user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('connections_user_id_idx').on(table.user_id)],
);

export const notifications = pgTable(
    'notifications',
    {
        date: date('date').notNull(),
        id: uuid('id').defaultRandom().primaryKey(),
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
