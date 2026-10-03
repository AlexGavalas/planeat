import { Divider, Stack, Switch, type SwitchProps, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { MealReminders } from '~features/meal-reminders';
import { useProfile } from '~hooks/use-profile';

export const AdvancedSettings = () => {
    const { t } = useTranslation();
    const { profile, updateProfile } = useProfile();

    const handleIsDiscoverableChange: SwitchProps['onChange'] = ({
        target: { checked },
    }) => {
        updateProfile({ isDiscoverable: checked });
    };

    return (
        <Stack gap="md">
            <Title order={3}>
                {t('account_settings.sections.advanced.title')}
            </Title>
            <Switch
                checked={profile?.is_discoverable}
                description={t(
                    'account_settings.sections.advanced.profile.toggle_discoverable_description',
                )}
                label={t(
                    'account_settings.sections.advanced.profile.toggle_discoverable_label',
                )}
                onChange={handleIsDiscoverableChange}
            />
            <Divider />
            <Title order={4}>{t('meal_reminders.title')}</Title>
            <MealReminders />
        </Stack>
    );
};
