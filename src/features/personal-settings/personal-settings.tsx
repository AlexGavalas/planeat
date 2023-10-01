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
        <Stack gap="md">
            <Title order={3}>
                {t('account_settings.sections.general.title')}
            </Title>
            {profile ? (
                <Group grow align="end">
                    <NumberInput
                        defaultValue={profile.height ?? undefined}
                        label={t('height_input')}
                        onChange={handleHeightChange}
                    />
                    <NumberInput
                        defaultValue={profile.target_weight ?? undefined}
                        label={t('target_weight_input')}
                        onChange={handleTargetWeightChange}
                    />
                    <Select
                        data={availableLanguages}
                        defaultValue={profile.language}
                        label={t('languages.label')}
                        onChange={handleLanguageChange}
                        placeholder={t('languages.placeholder')}
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
