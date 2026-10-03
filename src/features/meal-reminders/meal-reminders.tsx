'use client';

import { Button, Group, Stack, Switch, Text, TextInput } from '@mantine/core';
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

export const MealReminders = () => {
    const { t } = useTranslation();
    const [detectedTimezone, setDetectedTimezone] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
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
            const response = await fetch('/api/v1/notification-preferences');

            if (!response.ok) {
                return;
            }

            const { data } = (await response.json()) as {
                data: NotificationPreferences | null;
            };

            if (data) {
                setIsEnabled(data.meal_reminder_enabled);
                setTime(data.meal_reminder_time.slice(0, 5));
                setTimezone(data.timezone);
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

    const handleEnabledChange = async (nextEnabled: boolean): Promise<void> => {
        setIsSaving(true);

        try {
            if (nextEnabled) {
                await subscribeCurrentDevice();
            }

            await savePreferences(nextEnabled);
            setIsEnabled(nextEnabled);
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
            if (isEnabled) {
                await subscribeCurrentDevice();
            }

            await savePreferences(isEnabled);
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

    const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>): void => {
        void handleEnabledChange(event.currentTarget.checked);
    };

    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setTime(event.currentTarget.value);
    };

    const handleUseCurrentTimezone = (): void => {
        setTimezone(detectedTimezone);
    };

    const handleEnableDevice = async (): Promise<void> => {
        setIsSaving(true);

        try {
            await subscribeCurrentDevice();
            showSuccessNotification({
                message: t('meal_reminders.device_enabled'),
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

    if (isSupported === null) {
        return null;
    }

    if (!isSupported) {
        return <Text>{t('meal_reminders.unsupported')}</Text>;
    }

    return (
        <Stack gap="sm">
            <Switch
                checked={isEnabled}
                description={t('meal_reminders.description')}
                disabled={isSaving}
                label={t('meal_reminders.label')}
                onChange={handleSwitchChange}
            />
            <Group align="end">
                <TextInput
                    disabled={!isEnabled || isSaving}
                    label={t('meal_reminders.time')}
                    onChange={handleTimeChange}
                    type="time"
                    value={time}
                />
                <Button
                    disabled={!isEnabled}
                    loading={isSaving}
                    onClick={handleSave}
                >
                    {t('generic.actions.save')}
                </Button>
            </Group>
            <Text c="dimmed" size="sm">
                {t('meal_reminders.timezone', { timezone })}
            </Text>
            {detectedTimezone && timezone !== detectedTimezone && (
                <Button
                    disabled={isSaving}
                    onClick={handleUseCurrentTimezone}
                    variant="subtle"
                >
                    {t('meal_reminders.use_current_timezone', {
                        timezone: detectedTimezone,
                    })}
                </Button>
            )}
            {isEnabled && (
                <Button
                    loading={isSaving}
                    onClick={handleEnableDevice}
                    variant="subtle"
                >
                    {t('meal_reminders.enable_device')}
                </Button>
            )}
        </Stack>
    );
};
