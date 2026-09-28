'use client';

import { Container, Space, Tabs } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { Activities } from '~features/activities';
import { AdvancedSettings } from '~features/advanced-settings';
import { DeleteAccount } from '~features/delete-account';
import { FoodPreferences } from '~features/food-preferences';
import { Measurements } from '~features/measurements';
import { PersonalSettings } from '~features/personal-settings';

export function Settings() {
    const { t } = useTranslation();

    return (
        <Container>
            <Tabs defaultValue="measurements" id="settings">
                <Tabs.List>
                    <Tabs.Tab value="measurements">
                        {t('measurements')}
                    </Tabs.Tab>
                    <Tabs.Tab value="personal">{t('personal_info')}</Tabs.Tab>
                    <Tabs.Tab value="advanced">
                        {t('advanced_settings')}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel pt="md" value="measurements">
                    <Card>
                        <Measurements />
                    </Card>
                    <Space h="lg" />
                    <Card>
                        <Activities />
                    </Card>
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
