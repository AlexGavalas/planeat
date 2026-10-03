import {
    fetchNotificationPreferences,
    saveNotificationPreferences,
} from '~api/push-notification';
import { notificationPreferencesSchema } from '~schemas/push-notification';
import { getNextReminderAt } from '~util/meal-reminder';
import { withUser } from '~util/session';

export const GET = withUser(async ({ user }) => {
    const preferences = await fetchNotificationPreferences(user.id);
    return Response.json({ data: preferences });
});

export const PATCH = withUser(async ({ request, user }) => {
    const {
        mealReminderEnabled: isMealReminderEnabled,
        mealReminderTime,
        timezone,
    } = notificationPreferencesSchema.parse(await request.json());
    const nextNotificationAt = isMealReminderEnabled
        ? getNextReminderAt({ time: mealReminderTime, timezone })
        : null;

    await saveNotificationPreferences({
        enabled: isMealReminderEnabled,
        nextNotificationAt,
        time: mealReminderTime,
        timezone,
        userId: user.id,
    });

    return Response.json({ message: 'OK' });
});
