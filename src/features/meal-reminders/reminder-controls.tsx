import {
    Button,
    Collapse,
    Stack,
    Switch,
    Text,
    TextInput,
} from '@mantine/core';
import { type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsActions } from '~features/settings-actions';

type ReminderControlsProps = Readonly<{
    detectedTimezone: string;
    isBusy: boolean;
    isMealReminderEnabled: boolean;
    isPushEnabled: boolean;
    onMealReminderChange: ChangeEventHandler<HTMLInputElement>;
    onPushChange: ChangeEventHandler<HTMLInputElement>;
    onSave: () => void;
    onTimeChange: ChangeEventHandler<HTMLInputElement>;
    onUseCurrentTimezone: () => void;
    time: string;
    timezone: string;
}>;

export const ReminderControls = ({
    detectedTimezone,
    isBusy,
    isMealReminderEnabled,
    isPushEnabled,
    onMealReminderChange,
    onPushChange,
    onSave,
    onTimeChange,
    onUseCurrentTimezone,
    time,
    timezone,
}: ReminderControlsProps) => {
    const { t } = useTranslation();

    return (
        <Stack gap="lg">
            <Switch
                checked={isPushEnabled}
                description={t('meal_reminders.push_description')}
                disabled={isBusy}
                label={t('meal_reminders.push_label')}
                onChange={onPushChange}
                w="fit-content"
            />
            <Stack gap="sm">
                <Text fw="var(--mantine-font-weight-bold)">
                    {t('meal_reminders.categories_title')}
                </Text>
                <Switch
                    checked={isMealReminderEnabled}
                    description={t('meal_reminders.description')}
                    disabled={isBusy}
                    label={t('meal_reminders.label')}
                    onChange={onMealReminderChange}
                    w="fit-content"
                />
                <Collapse expanded={isMealReminderEnabled}>
                    <Stack gap="sm" ml="xl" mt="xs">
                        <TextInput
                            disabled={isBusy}
                            label={t('meal_reminders.time')}
                            loading={isBusy}
                            onChange={onTimeChange}
                            type="time"
                            value={time}
                        />
                        <Text c="dimmed" size="sm">
                            {t('meal_reminders.timezone', { timezone })}
                        </Text>
                        <SettingsActions>
                            <Button loading={isBusy} onClick={onSave}>
                                {t('generic.actions.save')}
                            </Button>
                        </SettingsActions>
                        {detectedTimezone && timezone !== detectedTimezone && (
                            <Button
                                disabled={isBusy}
                                onClick={onUseCurrentTimezone}
                                variant="subtle"
                                w="fit-content"
                            >
                                {t('meal_reminders.use_current_timezone', {
                                    timezone: detectedTimezone,
                                })}
                            </Button>
                        )}
                    </Stack>
                </Collapse>
            </Stack>
        </Stack>
    );
};
