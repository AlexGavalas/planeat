import { sql } from 'drizzle-orm';
import {
    bigint,
    check,
    index,
    pgTable,
    text,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const professionalClients = pgTable(
    'professional_clients',
    {
        accepted_at: timestamp('accepted_at', {
            mode: 'string',
            withTimezone: true,
        }),
        client_user_id: bigint('client_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        created_at: timestamp('created_at', {
            mode: 'string',
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        id: uuid('id').defaultRandom().primaryKey(),
        professional_user_id: bigint('professional_user_id', { mode: 'number' })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        status: text('status').notNull().default('pending'),
    },
    (table) => [
        unique('professional_clients_professional_client_unique').on(
            table.professional_user_id,
            table.client_user_id,
        ),
        uniqueIndex('professional_clients_one_active_professional_idx')
            .on(table.client_user_id)
            .where(sql`${table.status} = 'active'`),
        index('professional_clients_professional_status_idx').on(
            table.professional_user_id,
            table.status,
        ),
        index('professional_clients_client_status_idx').on(
            table.client_user_id,
            table.status,
        ),
        check(
            'professional_clients_status_check',
            sql`${table.status} IN ('pending', 'active')`,
        ),
        check(
            'professional_clients_distinct_users_check',
            sql`${table.professional_user_id} <> ${table.client_user_id}`,
        ),
    ],
);
