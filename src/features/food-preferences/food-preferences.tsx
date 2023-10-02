import { Button, Group, Stack, Textarea, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useCallback } from 'react';

import { updateFoodPreferences } from '~api/user';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

export const FoodPreferences = () => {
    const { t } = useTranslation();
    const supabase = useSupabaseClient<Database>();
    const { profile } = useProfile();

    const handleSavePreferences = useCallback<
        FormEventHandler<HTMLFormElement>
    >(
        async (e) => {
            e.preventDefault();

            if (!profile?.email) {
                return null;
            }

            const formData = new FormData(e.currentTarget);

            const positive = formData.get('positive')?.toString() ?? null;
            const negative = formData.get('negative')?.toString() ?? null;

            const { error } = await updateFoodPreferences({
                email: profile.email,
                negative,
                positive,
                supabase,
            });

            if (error) {
                showErrorNotification({
                    message: t('notification.error.message'),
                    title: t('notification.error.title'),
                });
            } else {
                showSuccessNotification({
                    message: t('notification.success.message'),
                    title: t('notification.success.title'),
                });
            }
        },
        [profile?.email, supabase, t],
    );

    return (
        <Stack align="start" gap="md">
            <Title order={3}>
                {t('account_settings.sections.food_preferences.title')}
            </Title>
            <form onSubmit={handleSavePreferences} style={{ width: '100%' }}>
                <Stack align="start" gap="md" style={{ width: '100%' }}>
                    <Group grow gap="md" style={{ width: '100%' }}>
                        <Textarea
                            autosize
                            defaultValue={
                                profile?.food_preferences_positive ?? ''
                            }
                            label={t(
                                'account_settings.sections.food_preferences.positive.label',
                            )}
                            minRows={4}
                            name="positive"
                            placeholder={t(
                                'account_settings.sections.food_preferences.positive.placeholder',
                            )}
                        />
                        <Textarea
                            autosize
                            defaultValue={
                                profile?.food_preferences_negative ?? ''
                            }
                            label={t(
                                'account_settings.sections.food_preferences.negative.label',
                            )}
                            minRows={4}
                            name="negative"
                            placeholder={t(
                                'account_settings.sections.food_preferences.negative.placeholder',
                            )}
                        />
                    </Group>
                    <Button type="submit">{t('save')}</Button>
                </Stack>
            </form>
        </Stack>
    );
};
