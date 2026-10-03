export type PushSubscriptionInput = {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        auth: string;
        p256dh: string;
    };
};

export type NotificationPreferences = {
    meal_reminder_enabled: boolean;
    meal_reminder_time: string;
    next_notification_at: string | null;
    timezone: string;
};
