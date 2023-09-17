import {
    Button,
    Group,
    NumberInput,
    type NumberInputProps,
    Select,
    type SelectProps,
    Stack,
    Title,
} from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';

export const PersonalSettings = () => {
    const { t } = useTranslation();
    const [height, setHeight] = useState<number>();
    const [targetWeight, setTargetWeight] = useState<number>();
    const [language, setLanguage] = useState<string>();
    const { profile, updateProfile } = useProfile();

    const handleHeightChange: NumberInputProps['onChange'] = (value) => {
        setHeight(Number(value));
    };

    const handleTargetWeightChange: NumberInputProps['onChange'] = (value) => {
        setTargetWeight(Number(value));
    };

    const handleLanguageChange: SelectProps['onChange'] = (value) => {
        setLanguage(value ?? undefined);
    };

    const handleSave = () => {
        updateProfile({
            language,
            height,
            targetWeight,
        });
    };

    const availableLanguages = [
        {
            value: 'en',
            label: t('languages.options.en'),
        },
        {
            value: 'gr',
            label: t('languages.options.el'),
        },
    ];

    return (
        <Stack spacing="md">
            <Title order={3}>
                {t('account_settings.sections.general.title')}
            </Title>
            {profile ? (
                <Group align="end" grow>
                    <NumberInput
                        label={t('height_input')}
                        defaultValue={profile.height ?? undefined}
                        onChange={handleHeightChange}
                    />
                    <NumberInput
                        label={t('target_weight_input')}
                        defaultValue={profile.target_weight ?? undefined}
                        onChange={handleTargetWeightChange}
                    />
                    <Select
                        label={t('languages.label')}
                        placeholder={t('languages.placeholder')}
                        defaultValue={profile.language}
                        onChange={handleLanguageChange}
                        data={availableLanguages}
                    />
                    <Button onClick={handleSave}>{t('save')}</Button>
                </Group>
            ) : (
                <div style={{ height: 100 }}>
                    <LoadingOverlay visible />
                </div>
            )}
        </Stack>
    );
};
