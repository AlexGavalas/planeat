import { and, eq, lte } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import {
    mealReminderDeliveries,
    notificationPreferences,
    pushSubscriptions,
    users,
} from '~db/schema';
import type {
    NotificationPreferences,
    PushSubscriptionInput,
} from '~types/push-notification';

export const savePushSubscription = async ({
    subscription,
    userId,
}: {
    subscription: PushSubscriptionInput;
    userId: number;
}): Promise<void> => {
    await getDb()
        .insert(pushSubscriptions)
        .values({
            auth: subscription.keys.auth,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            user_id: userId,
        })
        .onConflictDoUpdate({
            set: {
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
                updated_at: new Date().toISOString(),
                user_id: userId,
            },
            target: pushSubscriptions.endpoint,
        });
};

export const deletePushSubscription = async ({
    endpoint,
    userId,
}: {
    endpoint: string;
    userId: number;
}): Promise<void> => {
    await getDb()
        .delete(pushSubscriptions)
        .where(
            and(
                eq(pushSubscriptions.endpoint, endpoint),
                eq(pushSubscriptions.user_id, userId),
            ),
        );
};

export const deletePushSubscriptionByEndpoint = async (
    endpoint: string,
): Promise<void> => {
    await getDb()
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, endpoint));
};

export const fetchNotificationPreferences = async (
    userId: number,
): Promise<NotificationPreferences | null> =>
    (
        await getDb()
            .select()
            .from(notificationPreferences)
            .where(eq(notificationPreferences.user_id, userId))
            .limit(1)
    )[0] ?? null;

export const saveNotificationPreferences = async ({
    enabled,
    nextNotificationAt,
    time,
    timezone,
    userId,
}: {
    enabled: boolean;
    nextNotificationAt: Date | null;
    time: string;
    timezone: string;
    userId: number;
}): Promise<void> => {
    await getDb()
        .insert(notificationPreferences)
        .values({
            meal_reminder_enabled: enabled,
            meal_reminder_time: `${time}:00`,
            next_notification_at: nextNotificationAt?.toISOString() ?? null,
            timezone,
            user_id: userId,
        })
        .onConflictDoUpdate({
            set: {
                meal_reminder_enabled: enabled,
                meal_reminder_time: `${time}:00`,
                next_notification_at: nextNotificationAt?.toISOString() ?? null,
                timezone,
            },
            target: notificationPreferences.user_id,
        });
};

export const fetchDueMealReminders = async (
    now: Date,
): Promise<
    (Pick<
        typeof notificationPreferences.$inferSelect,
        'meal_reminder_time' | 'timezone' | 'user_id'
    > & { language: string })[]
> =>
    getDb()
        .select({
            language: users.language,
            meal_reminder_time: notificationPreferences.meal_reminder_time,
            timezone: notificationPreferences.timezone,
            user_id: notificationPreferences.user_id,
        })
        .from(notificationPreferences)
        .innerJoin(users, eq(notificationPreferences.user_id, users.id))
        .where(
            and(
                eq(notificationPreferences.meal_reminder_enabled, true),
                lte(
                    notificationPreferences.next_notification_at,
                    now.toISOString(),
                ),
            ),
        );

export const fetchPushSubscriptions = async (
    userId: number,
): Promise<(typeof pushSubscriptions.$inferSelect)[]> =>
    getDb()
        .select()
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.user_id, userId));

export const claimMealReminderDelivery = async ({
    localDate,
    userId,
}: {
    localDate: string;
    userId: number;
}): Promise<boolean> => {
    const rows = await getDb()
        .insert(mealReminderDeliveries)
        .values({ local_date: localDate, user_id: userId })
        .onConflictDoNothing()
        .returning({ id: mealReminderDeliveries.id });

    return rows.length > 0;
};

export const releaseMealReminderDelivery = async ({
    localDate,
    userId,
}: {
    localDate: string;
    userId: number;
}): Promise<void> => {
    await getDb()
        .delete(mealReminderDeliveries)
        .where(
            and(
                eq(mealReminderDeliveries.local_date, localDate),
                eq(mealReminderDeliveries.user_id, userId),
            ),
        );
};
