import { and, eq } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { notifications, users } from '~db/schema';
import type { Notification, NotificationWithUser } from '~types/notification';

export const fetchNotification = async ({
    requestUserId,
    targetUserId,
}: {
    requestUserId: number;
    targetUserId: number;
}): Promise<Pick<Notification, 'id'> | null> =>
    (
        await getDb()
            .select({ id: notifications.id })
            .from(notifications)
            .where(
                and(
                    eq(notifications.request_user_id, requestUserId),
                    eq(notifications.target_user_id, targetUserId),
                ),
            )
            .limit(1)
    )[0] ?? null;

export const createConnectionRequestNotification = async ({
    requestUserId,
    targetUserId,
}: {
    requestUserId: number;
    targetUserId: number;
}): Promise<{ error: null }> => {
    await getDb()
        .insert(notifications)
        .values({
            date: new Date().toISOString().slice(0, 10),
            notification_type: 'connection_request',
            request_user_id: requestUserId,
            target_user_id: targetUserId,
        });

    return { error: null };
};

export const fetchConnectionRequestNotifications = async ({
    userId,
}: {
    userId: number;
}): Promise<{ data: NotificationWithUser[] }> => ({
    data: await getDb()
        .select({
            date: notifications.date,
            id: notifications.id,
            notification_type: notifications.notification_type,
            request_user_id: notifications.request_user_id,
            target_user_id: notifications.target_user_id,
            users: { full_name: users.full_name },
        })
        .from(notifications)
        .innerJoin(users, eq(notifications.request_user_id, users.id))
        .where(
            and(
                eq(notifications.notification_type, 'connection_request'),
                eq(notifications.target_user_id, userId),
            ),
        ),
});

export const deleteConnectionRequestNotification = async ({
    id,
    userId,
}: {
    id: string;
    userId: number;
}): Promise<{ error: null }> => {
    await getDb()
        .delete(notifications)
        .where(
            and(
                eq(notifications.id, id),
                eq(notifications.target_user_id, userId),
            ),
        );

    return { error: null };
};
