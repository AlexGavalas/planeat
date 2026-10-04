'use client';

import {
    Button,
    Collapse,
    Group,
    Stack,
    Switch,
    Text,
    TextInput,
} from '@mantine/core';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { NotificationPreferences } from '~types/push-notification';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

const urlBase64ToUint8Array = (value: string): Uint8Array<ArrayBuffer> => {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const output = new Uint8Array(new ArrayBuffer(rawData.length));

    for (let index = 0; index < rawData.length; index += 1) {
        output[index] = rawData.charCodeAt(index);
    }

    return output;
};

const getSubscription = async (): Promise<PushSubscription> => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
        throw new Error('Push notifications are not configured');
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw new Error('Notification permission was not granted');
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
    });
    const existing = await registration.pushManager.getSubscription();

    return (
        existing ??
        registration.pushManager.subscribe({
            applicationServerKey: urlBase64ToUint8Array(publicKey),
            userVisibleOnly: true,
        })
    );
};

const subscribeCurrentDevice = async (): Promise<void> => {
    const subscription = await getSubscription();
    const response = await fetch('/api/v1/push-subscription', {
        body: JSON.stringify(subscription.toJSON()),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Could not save push subscription');
    }
};

const getCurrentSubscription = async (): Promise<PushSubscription | null> => {
    const registration = await navigator.serviceWorker.getRegistration('/');
    return registration?.pushManager.getSubscription() ?? null;
};

const isSubscriptionSaved = async (
    subscription: PushSubscription,
): Promise<boolean> => {
    const query = new URLSearchParams({ endpoint: subscription.endpoint });
    const response = await fetch(`/api/v1/push-subscription?${query}`);

    if (!response.ok) {
        return false;
    }

    const { data: isSaved } = (await response.json()) as { data: boolean };
    return isSaved;
};

const unsubscribeCurrentDevice = async (): Promise<void> => {
    const subscription = await getCurrentSubscription();

    if (!subscription) {
        return;
    }

    const response = await fetch('/api/v1/push-subscription', {
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Could not delete push subscription');
    }

    await subscription.unsubscribe();
};

export const MealReminders = () => {
    const { t } = useTranslation();
    const [detectedTimezone, setDetectedTimezone] = useState('');
    const [isMealReminderEnabled, setIsMealReminderEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPushEnabled, setIsPushEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSupported, setIsSupported] = useState<boolean | null>(null);
    const [time, setTime] = useState('20:00');
    const [timezone, setTimezone] = useState('UTC');

    useEffect(() => {
        const browserTimezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        setDetectedTimezone(browserTimezone);
        setTimezone(browserTimezone);
        setIsSupported(
            'serviceWorker' in navigator &&
                'PushManager' in window &&
                'Notification' in window,
        );

        const load = async (): Promise<void> => {
            try {
                const [preferencesResponse, subscription] = await Promise.all([
                    fetch('/api/v1/notification-preferences'),
                    getCurrentSubscription(),
                ]);

                if (subscription) {
                    setIsPushEnabled(await isSubscriptionSaved(subscription));
                }

                if (!preferencesResponse.ok) {
                    return;
                }

                const { data } = (await preferencesResponse.json()) as {
                    data: NotificationPreferences | null;
                };

                if (data) {
                    setIsMealReminderEnabled(data.meal_reminder_enabled);
                    setTime(data.meal_reminder_time.slice(0, 5));
                    setTimezone(data.timezone);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, []);

    const savePreferences = async (nextEnabled: boolean): Promise<void> => {
        const response = await fetch('/api/v1/notification-preferences', {
            body: JSON.stringify({
                mealReminderEnabled: nextEnabled,
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

    const handleMealReminderChange = async (
        nextEnabled: boolean,
    ): Promise<void> => {
        setIsSaving(true);

        try {
            await savePreferences(nextEnabled);
            setIsMealReminderEnabled(nextEnabled);
            showSuccessNotification({
                message: t('meal_reminders.saved'),
                title: t('notification.success.title'),
            });
        } catch {
            showErrorNotification({
                message: t('meal_reminders.error'),
                title: t('notification.error.title'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async (): Promise<void> => {
        setIsSaving(true);

        try {
            await savePreferences(isMealReminderEnabled);
            showSuccessNotification({
                message: t('meal_reminders.saved'),
                title: t('notification.success.title'),
            });
        } catch {
            showErrorNotification({
                message: t('meal_reminders.error'),
                title: t('notification.error.title'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleMealReminderSwitchChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        void handleMealReminderChange(event.currentTarget.checked);
    };

    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setTime(event.currentTarget.value);
    };

    const handleUseCurrentTimezone = (): void => {
        setTimezone(detectedTimezone);
    };

    const handlePushChange = async (nextEnabled: boolean): Promise<void> => {
        setIsSaving(true);

        try {
            if (nextEnabled) {
                await subscribeCurrentDevice();
            } else {
                await unsubscribeCurrentDevice();
            }

            setIsPushEnabled(nextEnabled);
            showSuccessNotification({
                message: t(
                    nextEnabled
                        ? 'meal_reminders.device_enabled'
                        : 'meal_reminders.device_disabled',
                ),
                title: t('notification.success.title'),
            });
        } catch {
            showErrorNotification({
                message: t('meal_reminders.error'),
                title: t('notification.error.title'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePushSwitchChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        void handlePushChange(event.currentTarget.checked);
    };

    if (isSupported === null) {
        return null;
    }

    if (!isSupported) {
        return <Text>{t('meal_reminders.unsupported')}</Text>;
    }

    const isBusy = isLoading || isSaving;

    return (
        <Stack gap="lg">
            <Switch
                checked={isPushEnabled}
                description={t('meal_reminders.push_description')}
                disabled={isBusy}
                label={t('meal_reminders.push_label')}
                onChange={handlePushSwitchChange}
                w="fit-content"
            />
            <Stack gap="sm">
                <Text fw="var(--mantine-font-weight-bold)">
                    {t('meal_reminders.categories_title')}
                </Text>
                <Switch
                    checked={isMealReminderEnabled}
                    description={t('meal_reminders.description')}
                    disabled={isBusy}
                    label={t('meal_reminders.label')}
                    onChange={handleMealReminderSwitchChange}
                    w="fit-content"
                />
                <Collapse expanded={isMealReminderEnabled}>
                    <Stack gap="sm" ml="xl" mt="xs">
                        <Group align="end">
                            <TextInput
                                disabled={isBusy}
                                label={t('meal_reminders.time')}
                                loading={isBusy}
                                onChange={handleTimeChange}
                                type="time"
                                value={time}
                            />
                            <Button loading={isBusy} onClick={handleSave}>
                                {t('generic.actions.save')}
                            </Button>
                        </Group>
                        <Text c="dimmed" size="sm">
                            {t('meal_reminders.timezone', { timezone })}
                        </Text>
                        {detectedTimezone && timezone !== detectedTimezone && (
                            <Button
                                disabled={isBusy}
                                onClick={handleUseCurrentTimezone}
                                variant="subtle"
                                w="fit-content"
                            >
                                {t('meal_reminders.use_current_timezone', {
                                    timezone: detectedTimezone,
                                })}
                            </Button>
                        )}
                    </Stack>
                </Collapse>
            </Stack>
        </Stack>
    );
};
