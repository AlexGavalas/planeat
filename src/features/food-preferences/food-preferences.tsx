import { Button, SimpleGrid, Stack, Textarea, Title } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useProfile } from '~hooks/use-profile';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

import { saveProfile } from '../../app/actions';
import styles from './food-preferences.module.css';

const formSchema = z.object({
    negative: z.string(),
    positive: z.string(),
});

export const FoodPreferences = () => {
    const { t } = useTranslation();
    const { isFetching, profile } = useProfile();
    const queryClient = useQueryClient();

    const handleSavePreferences = useCallback<SubmitEventHandler>(
        async (e) => {
            e.preventDefault();

            if (!profile?.email) {
                return null;
            }

            const formData = Object.fromEntries(new FormData(e.target));

            const { negative, positive } = formSchema.parse(formData);

            const response = await saveProfile({
                foodPreferencesNegative: negative,
                foodPreferencesPositive: positive,
            }).catch(() => ({ ok: false }));

            if (!response.ok) {
                showErrorNotification({
                    message: t('notification.error.message'),
                    title: t('notification.error.title'),
                });
            } else {
                await queryClient.invalidateQueries({ queryKey: ['user'] });

                showSuccessNotification({
                    message: t('notification.success.message'),
                    title: t('notification.success.title'),
                });
            }
        },
        [profile?.email, t, queryClient],
    );

    return (
        <Stack align="start" gap="md">
            <Title order={3}>
                {t('account_settings.sections.food_preferences.title')}
            </Title>
            <form onSubmit={handleSavePreferences} style={{ width: '100%' }}>
                <Stack align="start" gap="md" style={{ width: '100%' }}>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2 }}
                        spacing="md"
                        style={{ width: '100%' }}
                    >
                        <Textarea
                            autosize
                            defaultValue={
                                profile?.food_preferences_positive ?? ''
                            }
                            disabled={isFetching}
                            label={t(
                                'account_settings.sections.food_preferences.positive.label',
                            )}
                            loading={isFetching}
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
                            disabled={isFetching}
                            label={t(
                                'account_settings.sections.food_preferences.negative.label',
                            )}
                            loading={isFetching}
                            minRows={4}
                            name="negative"
                            placeholder={t(
                                'account_settings.sections.food_preferences.negative.placeholder',
                            )}
                        />
                    </SimpleGrid>
                    <Button
                        className={styles.saveButton}
                        loading={isFetching}
                        type="submit"
                    >
                        {t('generic.actions.save')}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
};
