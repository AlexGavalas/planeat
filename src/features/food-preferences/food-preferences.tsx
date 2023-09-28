import { Button, Group, Stack, Textarea, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler } from 'react';

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

    const handleSavePreferences: FormEventHandler<HTMLFormElement> = async (
        e,
    ) => {
        e.preventDefault();

        if (!profile?.email) {
            return null;
        }

        const formData = new FormData(e.currentTarget);

        const positive = formData.get('positive')?.toString() ?? null;
        const negative = formData.get('negative')?.toString() ?? null;

        const { error } = await updateFoodPreferences({
            positive,
            negative,
            supabase,
            email: profile.email,
        });

        if (error) {
            showErrorNotification({
                title: t('notification.error.title'),
                message: t('notification.error.message'),
            });
        } else {
            showSuccessNotification({
                title: t('notification.success.title'),
                message: t('notification.success.message'),
            });
        }
    };

    return (
        <Stack gap="md" align="start">
            <Title order={3}>
                {t('account_settings.sections.food_preferences.title')}
            </Title>
            <form onSubmit={handleSavePreferences} style={{ width: '100%' }}>
                <Stack gap="md" align="start" style={{ width: '100%' }}>
                    <Group gap="md" grow style={{ width: '100%' }}>
                        <Textarea
                            autosize
                            name="positive"
                            minRows={4}
                            defaultValue={
                                profile?.food_preferences_positive ?? ''
                            }
                            label={t(
                                'account_settings.sections.food_preferences.positive.label',
                            )}
                            placeholder={t(
                                'account_settings.sections.food_preferences.positive.placeholder',
                            )}
                        />
                        <Textarea
                            autosize
                            name="negative"
                            minRows={4}
                            defaultValue={
                                profile?.food_preferences_negative ?? ''
                            }
                            label={t(
                                'account_settings.sections.food_preferences.negative.label',
                            )}
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
