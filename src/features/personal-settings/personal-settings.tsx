import {
    Button,
    NumberInput,
    type NumberInputProps,
    Select,
    type SelectProps,
    SimpleGrid,
    Stack,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';

import styles from './personal-settings.module.css';

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
            height,
            language,
            targetWeight,
        });
    };

    const availableLanguages = [
        {
            label: t('languages.options.en'),
            value: 'en',
        },
        {
            label: t('languages.options.el'),
            value: 'gr',
        },
    ];

    return (
        <Stack gap="md">
            <Title order={3}>
                {t('account_settings.sections.general.title')}
            </Title>
            {profile ? (
                <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
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
                    <Button className={styles.saveButton} onClick={handleSave}>
                        {t('generic.actions.save')}
                    </Button>
                </SimpleGrid>
            ) : (
                <div style={{ height: 100 }}>
                    <LoadingOverlay visible />
                </div>
            )}
        </Stack>
    );
};
