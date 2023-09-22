import { Stack, Switch, type SwitchProps, Title } from '@mantine/core';
import { useTranslation } from 'next-i18next';

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
                label={t(
                    'account_settings.sections.advanced.profile.toggle_discoverable_label',
                )}
                checked={profile?.is_discoverable}
                description={t(
                    'account_settings.sections.advanced.profile.toggle_discoverable_description',
                )}
                onChange={handleIsDiscoverableChange}
            />
        </Stack>
    );
};
