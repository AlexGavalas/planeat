export const saveReminderPreferences = async ({
    enabled,
    time,
    timezone,
}: {
    enabled: boolean;
    time: string;
    timezone: string;
}): Promise<void> => {
    const response = await fetch('/api/v1/notification-preferences', {
        body: JSON.stringify({
            mealReminderEnabled: enabled,
            mealReminderTime: time,
            timezone,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error('Could not save notification preferences');
    }
};
