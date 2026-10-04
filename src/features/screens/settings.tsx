'use client';

import { Container, Space, Tabs } from '@mantine/core';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { AdvancedSettings } from '~features/advanced-settings';
import { DeleteAccount } from '~features/delete-account';
import { FoodPreferences } from '~features/food-preferences';
import { PersonalSettings } from '~features/personal-settings';

import styles from './settings.module.css';

type SettingsProps = Readonly<{
    activities: ReactNode;
    measurements: ReactNode;
}>;

export function Settings({ activities, measurements }: SettingsProps) {
    const { t } = useTranslation();

    return (
        <Container className={styles.container}>
            <Tabs defaultValue="measurements" id="settings">
                <Tabs.List className={styles.tabList}>
                    <Tabs.Tab
                        className={styles.tab}
                        id="settings-tab-measurements"
                        value="measurements"
                    >
                        {t('measurements')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        className={styles.tab}
                        id="settings-tab-personal"
                        value="personal"
                    >
                        {t('personal_info')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        className={styles.tab}
                        id="settings-tab-advanced"
                        value="advanced"
                    >
                        {t('advanced_settings')}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel pt="md" value="measurements">
                    <Card>{measurements}</Card>
                    <Space h="lg" />
                    <Card>{activities}</Card>
                </Tabs.Panel>
                <Tabs.Panel pt="md" value="personal">
                    <Card>
                        <PersonalSettings />
                    </Card>
                    <Space h="lg" />
                    <Card>
                        <FoodPreferences />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel pt="md" value="advanced">
                    <Card>
                        <AdvancedSettings />
                    </Card>
                    <Space h="lg" />
                    <Card>
                        <DeleteAccount />
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
